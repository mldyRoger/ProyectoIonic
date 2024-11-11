import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = 'http://127.0.0.1:5000/perfil'; // Reemplaza esto con la URL de tu API

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPerfil(): Observable<any> {
    const token = this.authService.getToken();
    console.log('Tokenxx:', token); 
    // Aquí añades el encabezado 'x-access-content'
    return this.http.get(this.apiUrl, {
      headers: {
        'x-access-token': token ? token : ''
      }
    });
  }
}
