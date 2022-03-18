import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  private httpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: this.sessionService.getToken(),
  });

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  register(user: User) {
    return this.http
      .post<User>(`${this.baseUrl}/register`, user)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers: this.httpHeaders,
    });
  }
  // temp
  getUserProfile(profileUrl: string): Observable<any> {
    //console.log(this.sessionService.getToken());
    return this.http.get<any>(`${this.baseUrl}/profile/${profileUrl}`, {
      headers: this.httpHeaders,
    });
  }

  updatePersonalInfo(id: string, user: User): Observable<Object> {
    return this.http.put(`${this.baseUrl}/details/${id}`, user, {
      headers: this.httpHeaders,
    });
  }

  updateSecurityEmail(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/security/email/${id}`, data, {
      headers: this.httpHeaders,
    });
  }

  updateSecurityPassword(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/security/password/${id}`, data, {
      headers: this.httpHeaders,
    });
  }

  updateSecurityInfo(id: string, user: any) {
    console.log('fetching');

    return this.http
      .put(`${this.baseUrl}/security/${id}`, user, {
        headers: this.httpHeaders,
      })
      .pipe(catchError(this.handleError));
  }

  // March 14 2pm add-ons
  get(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + `/test`, {
      headers: this.httpHeaders,
    });
  }

  getOne(id: number): Observable<Object> {
    return this.http.get<User>(`${this.baseUrl}/${id}` + `/test`, {
      headers: this.httpHeaders,
    });
  }
  // March 14 2pm add-ons

  // get users for searching
  getUsers(searchText: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + `/search/${searchText}` , {
      headers: this.httpHeaders,
    });
  }

  private handleError(error: HttpErrorResponse) {
    return error.error;
  }
  // March 14 2pm add-ons
}
