import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { friendStatus } from 'src/app/models/friend';
import { Post } from 'src/app/models/post';
import { FriendService } from 'src/app/services/friend.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChildren('theLastList', { read: ElementRef })
  theLastList: QueryList<ElementRef>;

  posts: Post[] = [];

  totalPages: number;
  currentPage: number = 0;

  observer: IntersectionObserver;

  rerender: boolean = false;
  showSpinner: boolean = false;

  id: string = localStorage.getItem('user_id');
  friendsList: friendStatus[] = [];

  constructor(
    private postService: PostService,
    private cdRef: ChangeDetectorRef,
    private friendService: FriendService
  ) {}

  ngOnInit(): void {
    this.id = localStorage.getItem('user_id');
    this.getPosts();
    this.intersectionObserver();

    // this.getFriendStatus(this.id);
  }

  ngAfterViewInit() {
    this.theLastList.changes.subscribe((data) => {
      if (data.last) {
        this.observer.observe(data.last.nativeElement);
      }
    });
  }

  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.currentPage < this.totalPages && this.posts.length >= 10) {
          this.currentPage++;
          this.getPosts();
        }
      }
    }, options);
  }

  getPosts() {
    this.showSpinner = true;
    this.postService
      .getPostsPagination(this.id, this.currentPage)
      .pipe(delay(1000))
      .subscribe((res) => {
        this.showSpinner = false;
        this.totalPages = res.totalPages;
        console.log(res);

        res.forEach((post: Post) => this.posts.push(post));
      });
  }

  // use this for rerender
  fetchPosts() {
    this.currentPage = 0;
    this.postService
      .getPostsPagination(this.id, 0)
      .subscribe((res) => (this.posts = res));
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.fetchPosts();
    });
  }

  onRefresh() {
    this.fetchPosts();
    this.rerender = true;
    this.cdRef.detectChanges();
    this.rerender = false;
  }

  getFriendStatus(id: string) {
    this.friendService
      .getFriendStatus(id)
      .subscribe((response) => (this.friendsList = response));
  }
}
