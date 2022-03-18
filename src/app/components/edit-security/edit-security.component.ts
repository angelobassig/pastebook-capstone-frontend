import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-security',
  templateUrl: './edit-security.component.html',
  styleUrls: ['./edit-security.component.css'],
})
export class EditSecurityComponent {
  emailChangeForm: FormGroup;
  passwordChangeForm: FormGroup;

  id: string;
  isLoading: boolean = false;
  success: boolean = false;

  isEmailEdit: boolean = false;
  isPasswordEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.emailChangeForm = this.formBuilder.group({
      currentEmail: ['', [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.passwordChangeForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });

    this.id = this.sessionService.getUserId();
    this.fetchCurrentEmail();
  }

  fetchCurrentEmail() {
    this.userService.getUserById(this.id).subscribe((res) => {
      this.emailChangeForm.get('currentEmail').patchValue(res['email']);
    });
  }

  onEmailSubmit() {
    this.isLoading = true;
    if (this.emailChangeForm.valid) {
      this.userService
        .updateSecurityEmail(this.id, this.emailChangeForm.value)
        .subscribe({
          next: this.onEmailSuccess.bind(this),
          error: this.onEmailFail.bind(this),
        });
    }
  }

  onEmailSuccess(response: any) {
    this.isLoading = false;
    this.sessionService.setId(response['id']);
    this.sessionService.setEmail(response['email']);
    this.sessionService.setToken(response['token']);
  }

  onEmailFail(response: any) {
    this.isLoading = false;
    console.log(response);
  }

  onPasswordSubmit() {
    this.isLoading = true;
    if (this.passwordChangeForm.valid) {
      this.userService
        .updateSecurityPassword(this.id, this.passwordChangeForm.value)
        .subscribe({
          next: this.onPasswordSuccess.bind(this),
          error: this.onPasswordFail.bind(this),
        });
    }
  }

  onPasswordSuccess(response: any) {
    this.isLoading = false;
    console.log(response);
  }

  onPasswordFail(response: any) {
    this.isLoading = false;
    console.log(response);
  }

  closeBtn() {
    this.success = false;
  }

  toggleEmail() {
    this.isEmailEdit = !this.isEmailEdit;
  }

  togglePassword() {
    this.isPasswordEdit = !this.isPasswordEdit;
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const newPassword = control.get('newPassword').value;
    const currentPassword = control.get('confirmPassword').value;
    return newPassword === currentPassword ? null : { mismatch: true };
  }
}
