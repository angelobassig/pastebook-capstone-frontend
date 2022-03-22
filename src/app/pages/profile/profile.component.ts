import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { FriendRequest } from 'src/app/models/friend-request';
import { Friend } from 'src/app/models/friend';
import { FriendService } from 'src/app/services/friend.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // March 14 2 pm add-ons
  hasToken: boolean = localStorage.getItem('token') !== null;
  receiverId: number = 0; // initiliazing
  senderId: number = parseInt(localStorage.getItem('idNumber')!);

  user: User;
  profileUrl: string;


  isButtonStatus: boolean = true;
  currentUserId: string = localStorage.getItem('user_id');
  profileId: string;
  friends: User[] = [];

  isFriends: boolean = false;
  friendRequestList: User[] = [];
  // for button state
  //oneFriendRequest: FriendRequest = new FriendRequest();
  //oneFriend: Friend = new Friend();
  //oneFriend2: Friend = new Friend();

  requestPending: boolean;
  requestFromTheUserPending: boolean;
  // March 14 2 pm add-ons

  image: SafeResourceUrl;
  //private sanitizer: DomSanitizer;
  selectedFile;

  isUploadSection: boolean;
  
  @ViewChildren('theLastList', { read: ElementRef })
  theLastList: QueryList<ElementRef>;

  posts: Post[] = [];

  id: string = localStorage.getItem('user_id');
  rerender: boolean = false;
  showSpinner: boolean = false;

  observer: IntersectionObserver;
  totalPages: number = 0;
  currentPage: number = 0;

  friendName: string;
  friendId: string;


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private friendRequestService: FriendRequestService,

    private friendService: FriendService,
    private sanitizer: DomSanitizer,
    private postService: PostService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const url = localStorage.getItem('profileUrl');
    if (this.router.url !== '/' + url) {
      const friendUrl = this.router.url.replace('/', '');
      const id = friendUrl.match(/\d+/g);

      this.userService.getUserById(id[0]).subscribe((response: any) => {
        this.friendName = response.firstName + ' ' + response.lastName;
        this.friendId = response.id;
      });
    }
      
    this.route.params.subscribe(
      params => {
        
      this.selectedFile=null;
      this.isUploadSection = false;
      this.profileUrl = this.route.snapshot.params['profileUrl']

      // this.userId = profileUrlUser.replace(/\D/g, '');
      this.userService
        .getUserProfile(this.profileUrl)
        .subscribe((response: any) => {
          this.user = response;

          //sconsole.log(this.user.image.picByte)
          if (this.user.image) {
            console.log('cleaning');
            this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:image/png;base64,' + this.user.image.picByte
            );

            console.log(this.image);
          }
        });
      // userService.getOne(Number(this.userId)).subscribe((response: any) => {
      //   this.user = response;
      // });

      // console.log(this.isOwner()); // this fires off upon loading the page (basically, put all the functions you want to be automatically called when you load the page)
      this.requestPending = false;
      this.requestFromTheUserPending = false;
      if (this.isOwner()) {
      } else {
        this.friendService
          .getFriends(Number(this.currentUserId))
          .subscribe((response: any) => {
            this.friends = response;
            //console.log(this.friends);
            for (const friend of this.friends) {
              if (friend.profileUrl == this.profileUrl) {
                this.isFriends = true;
                console.log('This is your friend');
                break;
              }
            }
            if (!this.isFriends) {
              console.log(this.isFriends);
              // console.log()
              // console.log(this.currentUserId)
              this.friendRequestService
                .getOneFriendRequest(this.user.id, Number(this.currentUserId))
                .subscribe((response: FriendRequest) => {
                  if (response.id != null) {
                    //this.oneFriendRequest = response;
                    console.log('He already sent a request!');
                    this.requestFromTheUserPending = true;
                  }
                });
              this.friendRequestService
                .getOneFriendRequest(Number(this.currentUserId), this.user.id)
                .subscribe((response: FriendRequest) => {
                  //console.log(response.id)

                  if (response.id != null) {
                    console.log('You already sent a request!');
                    this.requestPending = true;
                  }
                });
            }
          });
      }
    });

    this.id = localStorage.getItem('user_id');
    this.getPosts();
    this.intersectionObserver();
  }

  ngAfterViewInit() {
    this.theLastList.changes.subscribe((data) => {
      if (data.last) {
        this.observer.observe(data.last.nativeElement);
      }
    });
  }
  toggleUpload(){
    this.isUploadSection = !this.isUploadSection;
  }
  sendFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));

    //console.log(this.currentUserId+ " adding" + this.user.id)
    this.friendRequestService
      .sendFriendRequest(Number(this.currentUserId), this.user.id)
      .subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error) => {
          //ignore the errors lol
          this.ngOnInit();
        }
      );

    // need to add code here that changes the status of the button
  }

  removeFriend(): void {
    console.log(
      this.currentUserId + ' accepted friend request from' + this.user.id
    );
    this.friendService
      //acceptFriend(requesterId: number, recipientId: number)
      .deleteFriend(Number(this.currentUserId), this.user.id)
      .subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error) => {
          //ignore the errors lol
          this.ngOnInit();
        }
      );
  }

  // addImage():void{
  //   console.log("Upload")
  // }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.userService.uploadProfilePicture(fd).subscribe((response:any)=>{
      this.toggleUpload();
      this.ngOnInit();
    })
    //this.http
  }

  acceptFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));


    console.log(
      this.currentUserId + ' accepted friend request from' + this.user.id
    );
    this.friendService
      //acceptFriend(requesterId: number, recipientId: number)
      .acceptFriend(this.user.id, Number(this.currentUserId))
      .subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error) => {
          //ignore the errors lol
          this.ngOnInit();
        }
      );


    // need to add code here that changes the status of the button
  }

  declineOrCancelFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));

    let senderId: number, receiver: number;
    if (this.requestPending) {
      senderId = Number(this.currentUserId);
      receiver = this.user.id;
      //console.log(senderId+ " cancelled request from " + receiver)
    } else {
      senderId = this.user.id;
      receiver = Number(this.currentUserId);
      //console.log(receiver+ " declined request from " + senderId)
    }

    this.friendRequestService
      .cancelFriendRequest(Number(this.currentUserId), this.user.id)
      .subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error) => {
          //ignore the errors lol
          this.ngOnInit();
        }
      );


    // need to add code here that changes the status of the button
  }

  isOwner(): boolean {
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));

    if (this.profileUrl == localStorage.getItem('profileUrl')) {

      return true;
    } else {
      return false;
    }
  }

  // // returns the profileUrl of the current page you're visiting
  getProfileUrl(): string {
    return this.route.snapshot.params['profileUrl'];
  }


  // Post component
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
        res.forEach((post: Post) => this.posts.push(post));
      });
  }

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

  // changing the name of the button upon clicking
  // changeName() {
  //   this.isButtonStatus = false;
  // }

  // March 14 2pm add-ons
}