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
    return this.httpClient.post('https://parcial2api-production.up.railway.app/api/auth/registro', registerForm.value);
  }

  login(email: string, password: string) {
    return this.httpClient.post<any>(`https://parcial2api-production.up.railway.app/api/auth/login`, { email, password })
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

  getUserDataFromToken(): any {
    const token = this.getToken();
    if (token) {
      return this.parseJwt(token); // Llamamos a la función parseJwt para decodificar el token
    }
    return null;
  }

  // Función para decodificar el JWT y extraer el payload
  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];  // La segunda parte es el payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // Ajustar base64Url a base64 estándar
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);  // Devolver el objeto JSON del payload
  }
  
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
