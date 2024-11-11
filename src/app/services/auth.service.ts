import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(
    private httpClient: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(registerForm: FormGroup){
    return this.httpClient.post('http://127.0.0.1:5000/registro', registerForm.value);
  }

  login(email: string, password: string) {
    return this.httpClient.post<any>(`http://127.0.0.1:5000/login`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.token || null;
  }
  
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
