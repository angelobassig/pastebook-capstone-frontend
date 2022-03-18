import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { FriendRequest } from 'src/app/models/friend-request';
import { Friend } from 'src/app/models/friend';
import { FriendService } from 'src/app/services/friend.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
// March 14 2pm add-ons
friendList: User[] = [];
isButtonVisible: boolean = true;
hasToken: boolean = (localStorage.getItem('token') !== null);
senderId: number = parseInt(localStorage.getItem('idNumber')!);
// March 14 2pm add-ons

// March 18 codes
image: SafeResourceUrl;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private friendRequestService: FriendRequestService,
    private friendService: FriendService,
    private sanitizer: DomSanitizer
  ) {
    let profileUrl: string = this.route.snapshot.params['profileUrl'];
    let userId: number = parseInt(profileUrl.replace(/\D/g, ""));

    friendService.getFriends(this.senderId).subscribe((response: User[]) => {
      this.friendList = response;})
   }

  ngOnInit(): void {
    
  }

  // delete friend
  deleteFriend(userId: number): void {
    let profileUrl: string = this.route.snapshot.params['profileUrl'];
    let friendId: number = parseInt(profileUrl.replace(/\D/g, ""));

    this.friendService.deleteFriend(userId, friendId).subscribe(() => {});
    // who is the requester here and who is the recipient (need ko ito i explain ww)

  }

  isOwner(): boolean {
    let profileUrl: string = this.route.snapshot.params['profileUrl'];
    let userId: number = parseInt(profileUrl.replace(/\D/g, ""));
    if (this.senderId == userId) {
      return true;
    } else {
      return false;
    }
  }

   // removing a card
   removeUserFromUserList(card: User) {
    let index = this.friendList.indexOf(card);
    this.friendList.splice(index, 1);
  }

}
