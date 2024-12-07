import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, push, update, remove } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService { 
  private db: any;
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyBNiRfqnixu8Oi7Z0CRkc8nPJSA3PJSe2c",
      authDomain: "appasistentes.firebaseapp.com",
      databaseURL: "https://appasistentes-default-rtdb.firebaseio.com",
      projectId: "appasistentes",
      storageBucket: "appasistentes.firebasestorage.app",
      messagingSenderId: "634175294662",
      appId: "1:634175294662:web:2a50dcbe9698ce8b0adbc7"
    };
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }
  // Crear o registrar un asistente
  registerAsistente(asistenteData: any): Promise<any> {
    const asistentesRef = ref(this.db, 'asistentes');
    const newAsistenteRef = push(asistentesRef); // Crea una nueva referencia única
    return set(newAsistenteRef, asistenteData); // Guarda los datos del asistente
  }
  // Método para agregar un asistente a un evento
  addAssistance(eventId: string, assistant: { name: string, email: string }) {
    const assistantRef = ref(this.db, `events/${eventId}/attendees`);
    const newAssistantRef = push(assistantRef);
    return set(newAssistantRef, assistant);
  }
  // Escuchar los cambios en los asistentes de un evento en tiempo real
  getAssistance(eventId: string): Observable<any> {
    const assistantRef = ref(this.db, `events/${eventId}/attendees`);
    const assistantChanges = new Observable<any>((observer) => {
      onValue(assistantRef, (snapshot) => {
        const data = snapshot.val();
        observer.next(data);  // Emitir los datos de los asistentes cuando cambian
      });
    });
    return assistantChanges;
  }

  // Leer un asistente específico
  getAsistente(id: string): Promise<any> {
    const asistenteRef = ref(this.db, 'asistentes/' + id);
    return get(asistenteRef).then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();  // Devuelve los datos del asistente
      } else {
        throw new Error('Asistente no encontrado');
      }
    });
  }

  // Leer todos los asistentes
  getAllAsistentes(): Observable<any> {
    const asistentesRef = ref(this.db, 'asistentes');
    return new Observable(observer => {
      get(asistentesRef).then(snapshot => {
        if (snapshot.exists()) {
          observer.next(snapshot.val());  // Devuelve todos los asistentes
        } else {
          observer.error('No hay asistentes registrados');
        }
      }).catch(err => observer.error(err));
    });
  }

  // Actualizar datos de un asistente
  updateAsistente(id: string, updatedData: any): Promise<void> {
    const asistenteRef = ref(this.db, 'asistentes/' + id);
    return update(asistenteRef, updatedData); // Actualiza los datos del asistente
  }

  // Eliminar un asistente
  deleteAsistente(id: string): Promise<void> {
    const asistenteRef = ref(this.db, 'asistentes/' + id);
    return remove(asistenteRef); // Elimina el asistente de la base de datos
  }
   // Escribir datos
   /*setData(path: string, data: any): Promise<void> {
    return this.db.object(path).set(data);
  }*/
    /*public pushData(path: string, data: any) {
      const dbRef = ref(this.db, path);
      return push(dbRef, data)  // Usamos push() para agregar datos con un ID único
        .then(() => {
          console.log('Data pushed successfully');
        })
        .catch((error) => {
          console.error('Error pushing data:', error);
          throw error;
        });
    }

  public setData(path: string, data: any) {
    const dbRef = ref(this.db, path);
    return set(dbRef, data)  // Usamos set() para escribir o reemplazar datos en Firebase
      .then(() => {
        console.log('Data sent successfully');
      })
      .catch((error) => {
        console.error('Error sending data:', error);
        throw error;
      });
  }*/

  // Leer datos en tiempo real
/*getData(path: string): Observable<any> {
    return this.db.object(path).valueChanges();
  }*/
   /* public getDataD(path: string): Observable<any> {
      return this.db.object(path).valueChanges(); 
    }

    public getData(path: string): Observable<any> {
      return this.db.object(path).valueChanges();  // Usamos AngularFireDatabase para obtener datos en tiempo real
    }*/
}
