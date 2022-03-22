import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Likes } from 'src/app/models/likes';
import { Post } from 'src/app/models/post';
import { CommentService } from 'src/app/services/comment.service';
import { LikeService } from 'src/app/services/like.service';

import { LoginService } from 'src/app/services/login.service';
import { TriggerNotificationsService } from 'src/app/services/trigger-notifications.service';

import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() delete = new EventEmitter<string>();

  isLiked: boolean = false;

  image: SafeResourceUrl;

  profileUrl = '/' + this.sessionService.getProfileUrl();

  commentForm = this.fb.group({
    comment: ['', Validators.required],
  });

  constructor(
    private likeService: LikeService,
    private commentService: CommentService,
    private triggerNotif: TriggerNotificationsService,

    private postService: PostService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.post.image) {
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/png;base64,' + this.post.image.picByte
      );
    }

    this.post.likes.forEach((like) => {
      if (like.user.id.toString() === this.sessionService.getUserId()) {
        this.isLiked = true;
      }
    });
  }

  getPost() {
    this.postService.getPostById(this.post.id).subscribe((post) => {
      this.post = post;
      this.ngOnInit();
    });
  }

  onComment() {
    this.commentService
      .addComment(this.post.id, this.commentForm.value)
      .subscribe(() => {
        this.commentForm.reset();
        this.ngOnInit();
        //this.triggerNotif.triggerNotif(this.triggerNotif.ws);
        this.getPost();
      });
  }

  parseDate(formatDate: string) {
    const [date, time] = formatDate.split(' ');
    const [year, month, day] = date.split('/');
    return new Date(`${month}/${day}/${year}`)
      .toUTCString()
      .split(' ')
      .slice(0, 4)
      .join(' ');
  }

  like() {
    this.likeService.likePost(this.post.id).subscribe(() => {
      this.isLiked = true;
      this.getPost();
    });
  }

  unlike() {
    this.likeService.unlikePost(this.post.id).subscribe(() => {
      this.isLiked = false;
      this.getPost();
    });
  }

  displayMenuBtn() {
    const userId = this.sessionService.getUserId();
    return this.post.user.id === parseInt(userId);
  }

  deletePost(id: string) {
    this.delete.emit(id);
  }

  updatePost(postId: string, formData: any) {
    this.postService.updatePost(postId, formData).subscribe(() => {
      this.ngOnInit();
    });
  }

  get likes(): Likes[] {
    return this.post.likes;
  }
}
