import { Component, Input, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notificationModel';

@Component({
  selector: 'app-notification-page-card',
  templateUrl: './notification-page-card.component.html',
  styleUrls: ['./notification-page-card.component.css']
})
export class NotificationPageCardComponent implements OnInit {

  @Input() notification!: NotificationModel;
  
  constructor() { }

  ngOnInit(): void {
  }

}
