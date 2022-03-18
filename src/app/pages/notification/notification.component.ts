import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notificationModel';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: NotificationModel[] = [];
  notification: NotificationModel;
  constructor( private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(){
    this.notificationService.getAllNotification().subscribe((response: any) => {
      console.log(response);
      this.notifications = response;
    })
  }
}
