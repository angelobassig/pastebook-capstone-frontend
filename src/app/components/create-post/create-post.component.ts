import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';
import { Friends } from '../tag-friends/tag-friends.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  name: string;
  displayTagged: Friends[] = [];
  displayTaggedLength = 0;
  imagePreview = '';
  isLoading: boolean = false;

  postForm: FormGroup = this.fb.group(
    {
      content: '',
      image: '',
      tagged: '',
    },
    { validators: this.emptyFieldValidator }
  );

  @Output() refresh = new EventEmitter<boolean>();

  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.name = this.sessionService.getName();
  }

  onSubmit() {
    this.displayTaggedLength = 0;
    if (this.postForm.valid) {
      this.isLoading = true;
      this.postService.createPost(this.prepareSave()).subscribe({
        next: this.onSuccess.bind(this),
      });
    }
  }

  onSuccess(res: any) {
    this.refresh.emit(true);
    this.isLoading = false;
    this.removeImage();
    this.postForm.get('content').setValue('');
    this.postForm.reset();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.image.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  prepareSave(): FormData {
    const fd = new FormData();

    if (this.content.value) {
      fd.append('content', this.content.value);
    }

    if (this.tagged.value) {
      fd.append('tagged', this.tagged.value);
    }

    if (this.image.value) {
      fd.append('image', this.image.value);
    }

    return fd;
  }

  emptyFieldValidator(control: AbstractControl): ValidationErrors | null {
    const content = control.get('content');
    const image = control.get('image');

    return content.value || image.value ? null : { emptyField: true };
  }

  addImage() {
    this.imageInput.nativeElement.click();
  }

  removeImage() {
    this.imagePreview = '';
    this.image.setValue('');
  }

  get image() {
    return this.postForm.get('image');
  }

  get content() {
    return this.postForm.get('content');
  }

  get tagged() {
    return this.postForm.get('tagged');
  }

  // Tag Friends
  ngDoCheck(): void {
    this.postForm.valueChanges.subscribe((data) => {
      this.displayTagged = data['tagged'];
      if (this.displayTagged) {
        this.displayTaggedLength = this.displayTagged.length;
      }
    });
  }

  getTaggedFriends(friends: Friends[]) {
    console.log(friends);
    this.tagged.setValue(friends);
  }
}
