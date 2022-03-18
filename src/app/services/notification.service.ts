import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationModel } from '../models/notificationModel';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = `${environment.apiUrl}/notifications`;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: this.sessionService.getToken(),
  });

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  // For notification badge

  // getNotificationShort(formData: FormData): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/short`, formData, {
  //     headers: this.httpHeaders,
  //   });
  // }

  seenNotificationShort(notifications:NotificationModel[]):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/seen`, notifications, {
      headers: this.httpHeaders,
    });
  }

  getNotificationShort(): Observable<NotificationModel[]> {
    //console.log(this.sessionService.getToken());
    
    return this.http.get<NotificationModel[]>(this.baseUrl + "/short",{
      headers: this.httpHeaders
    });
  }

  
  
    //For Notification page 
    getAllNotification(): Observable<NotificationModel[]> {
      //console.log(this.sessionService.getToken());
      
      return this.http.get<NotificationModel[]>(this.baseUrl + "/all",{
        headers: this.httpHeaders
      });
    }
  
  // getAllNotification(formData: FormData): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/all`, formData, {
  //     headers: this.httpHeaders,
  //   });
  // }
  
}
