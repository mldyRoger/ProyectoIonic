import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, push, update, remove } from 'firebase/database';
import { HttpClient } from '@angular/common/http';
import { ConectionRealTimeService } from './conection-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class AttendeesService {
  private API_URL = 'https://parcial2api-production.up.railway.app/api/qr';
  private db: any;
  constructor(private http: HttpClient, private conectionRealTimeService: ConectionRealTimeService) {
    this.db = this.conectionRealTimeService.getDatabase(); 
  }
  sendQR( asistente: string, evento: string, descripcion: string, fecha: string,email: string, qrData: string ): Observable<any> {
    const body = {
      asistente: asistente,
      evento:evento,
      descripcion: descripcion,
      qrData: qrData,  
      email: email,
      fecha: fecha     
    };
    return this.http.post(`${this.API_URL}/send-qr/`, body);
  }
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user);
  }
  //Registrar un asistente
  registerAssistant(eventId:string, eventData: any): Promise<any> {
    const assistantRef = ref(this.db, 'eventos/'+eventId+'/asistentes');
    const newAssistentRef = push(assistantRef); 
    return set(newAssistentRef, eventData); 
  }

  // Actualizar evento
  updateAssistant(eventId: string, idAssistant: string, updatedData: any): Promise<void> {
    const assistantRef = ref(this.db, 'eventos/'+eventId+'/asistentes/'+idAssistant);
    return update(assistantRef, updatedData); 
  }

  getAssistantsRealTime(eventId: string): Observable<any> {
    const assistantRef = ref(this.db, 'eventos/'+eventId+'/asistentes');
    const assistentChanges = new Observable<any>((observer) => {
      onValue(assistantRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const assistantsWithId = Object.entries(data).map(([id, assistant]) => {
            if (assistant && typeof assistant === 'object') {
              return {
                id,
                ...assistant 
              };
            } else {
              return { id, assistant };
            }
          });
          observer.next(assistantsWithId); 
        } else {
          observer.next([]); 
        }
      });
    });
    
    return assistentChanges;  // Devolver el observable
  }
}
