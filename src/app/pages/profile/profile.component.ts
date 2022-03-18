import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { FriendRequest } from 'src/app/models/friend-request';
import { Friend } from 'src/app/models/friend';
import { FriendService } from 'src/app/services/friend.service';

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
  currentUserId: string = localStorage.getItem("user_id");
  profileId: string;
  friends: User[] = []
  isFriends: boolean = false;
  friendRequestList: User[] = [];
  // for button state
  //oneFriendRequest: FriendRequest = new FriendRequest();
  //oneFriend: Friend = new Friend();
  //oneFriend2: Friend = new Friend();
  requestPending:boolean;
  requestFromTheUserPending:boolean;
  // March 14 2 pm add-ons



  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private friendRequestService: FriendRequestService,
    private friendService: FriendService
  ) {
      
    }
     

   
  ngOnInit(): void {
      
    this.route.params.subscribe(
      params => {
        this.profileUrl = this.route.snapshot.params['profileUrl']
      // this.userId = profileUrlUser.replace(/\D/g, '');
      this.userService.getUserProfile(this.profileUrl).subscribe((response: any) => {
          this.user = response;
        });
      // userService.getOne(Number(this.userId)).subscribe((response: any) => {
      //   this.user = response;
      // });

    // console.log(this.isOwner()); // this fires off upon loading the page (basically, put all the functions you want to be automatically called when you load the page)
    this.requestPending = false;
    this.requestFromTheUserPending = false;  
    if(this.isOwner()){
        
      }else{
        this.friendService.getFriends(Number(this.currentUserId)).subscribe((response: any) => {
          this.friends = response;
          //console.log(this.friends);
          for (const friend of this.friends) {
              if(friend.profileUrl == this.profileUrl){
                  this.isFriends = true;
                  console.log("This is your friend");
                  break;
              }
          }
          if(!this.isFriends){
            console.log(this.isFriends);
            // console.log()
            // console.log(this.currentUserId)
            this.friendRequestService
            .getOneFriendRequest(this.user.id, Number(this.currentUserId))
            .subscribe((response: FriendRequest) => {
            
              
              if(response.id != null){
                //this.oneFriendRequest = response;
                console.log("He already sent a request!");
                this.requestFromTheUserPending = true;
            }
            
            });
            this.friendRequestService.getOneFriendRequest( Number(this.currentUserId),this.user.id).subscribe((response:FriendRequest)=>{
              //console.log(response.id)
            
              if(response.id != null){
                  console.log("You already sent a request!");
                    this.requestPending = true;
              }
            
            })
          
            
          }
        });
      }
    })
  }

 
  sendFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));

    //console.log(this.currentUserId+ " adding" + this.user.id)
    this.friendRequestService
      .sendFriendRequest(Number(this.currentUserId),  this.user.id)
      .subscribe((response:any)=>{
        this.ngOnInit();
      },
      error=>{
        //ignore the errors lol
        this.ngOnInit();
      });

    // need to add code here that changes the status of the button
  }

  removeFriend():void{
    console.log(this.currentUserId+ " accepted friend request from" + this.user.id)
    this.friendService.
    //acceptFriend(requesterId: number, recipientId: number)
      deleteFriend(Number(this.currentUserId),  this.user.id)
      .subscribe((response:any)=>{
        this.ngOnInit();
      },
      error=>{
        //ignore the errors lol
        this.ngOnInit();
      });
  }

  acceptFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));

    console.log(this.currentUserId+ " accepted friend request from" + this.user.id)
    this.friendService.
    //acceptFriend(requesterId: number, recipientId: number)
      acceptFriend(this.user.id,Number(this.currentUserId))
      .subscribe((response:any)=>{
        this.ngOnInit();
      },
      error=>{
        //ignore the errors lol
        this.ngOnInit();
      });

    // need to add code here that changes the status of the button
  }

  declineOrCancelFriendRequest(): void {
    //let profileUrl: string = this.route.snapshot.params['profileUrl'];
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));
    let senderId:number, receiver:number
      if(this.requestPending){
          senderId = Number(this.currentUserId);
          receiver = this.user.id
          //console.log(senderId+ " cancelled request from " + receiver)
      }else{
          senderId = this.user.id
          receiver = Number(this.currentUserId);
          //console.log(receiver+ " declined request from " + senderId)
      }
    
    this.friendRequestService
      .cancelFriendRequest(Number(this.currentUserId),  this.user.id)
      .subscribe((response:any)=>{
        this.ngOnInit();
      },
      error=>{
        //ignore the errors lol
        this.ngOnInit();
      });

    // need to add code here that changes the status of the button
  }

  isOwner(): boolean {
    //let userId: number = parseInt(profileUrl.replace(/\D/g, ''));
    if (this.profileUrl == localStorage.getItem("profileUrl")) {
      return true;
    } else {
      return false;
    }
  }

  // // returns the profileUrl of the current page you're visiting
  getProfileUrl(): string {
    return this.route.snapshot.params['profileUrl'];
  }

  // changing the name of the button upon clicking
  // changeName() {
  //   this.isButtonStatus = false;
  // }

  // March 14 2pm add-ons
}