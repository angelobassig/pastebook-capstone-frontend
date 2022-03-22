import { EventEmitter, Injectable, Output } from '@angular/core';

/**
 * Todo:
 * [] Manage multiple local user/tokens
 */

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  @Output() hasToken: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    if (localStorage.getItem('token') !== null) {
      this.hasToken.emit(true);
    } else {
      this.hasToken.emit(false);
    }
  }

  getToken(): string {
    return localStorage.getItem('token')!;
  }

  getId(): number {
    return parseInt(localStorage.getItem('id')!);
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getEmail(): string {
    return localStorage.getItem('email')!;
  }

  // March 14 2 pm add-ons
  getProfileUrl(): string {
    return localStorage.getItem('profileUrl')!;
  }

  getIdNumber(): number {
    return parseInt(localStorage.getItem('idNumber')!);
  }
  // March 14 2 pm add-ons

  getName(): string {
    return localStorage.getItem('name')!;
  }

  getProfilePic(): string {
    return localStorage.getItem('profilePic')!;
  }

  setProfilePic(profilePic: string) {
    localStorage.setItem('profilePic', profilePic);
  }

  setToken(token: string) {
    this.hasToken.emit(true);
    localStorage.setItem('token', token);
  }

  setUserId(id: string) {
    localStorage.setItem('user_id', id);
  }

  setId(value: string): void {
    this.hasToken.emit(true);
    localStorage.setItem('id', value);
  }

  setEmail(email: string) {
    localStorage.setItem('email', email);
  }

  setProfileUrl(value: string): void {
    localStorage.setItem('profileUrl', value);
  }

  setIdNumber(value: string): void {
    this.hasToken.emit(true);
    localStorage.setItem('idNumber', value);
  }

  setName(name: string) {
    localStorage.setItem('name', name);
  }

  clear() {
    localStorage.clear();
    this.hasToken.emit(false);
  }
}
