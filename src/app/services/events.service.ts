// Definir tipos para el evento y los asistentes
interface Asistente {
  correo: string;
  nombre: string;
  status: string;
  telefono: string;
}

interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  status: string;
  user: string;
  asistentes?: { [key: string]: Asistente };  // La propiedad 'asistentes' es opcional
}
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, push, update, remove,query, orderByChild, equalTo } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})

export class EventsService {
  private db: any;
  private isEvento(event: any): event is Evento {
    return (
      typeof event === 'object' &&
      'nombre' in event &&
      'descripcion' in event &&
      'fecha' in event &&
      'status' in event &&
      'user' in event &&
      'id' in event
    );
  }
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

  getEvents(): Observable<any> {
    const eventRef = ref(this.db, `eventos`);
    const eventsChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
        observer.next(data);  // Emitir los datos de los eventos cuando cambian
      });
    });
    return eventsChanges;
  }
  //Registrar un evento
  registerEvent(eventData: any): Promise<any> {
    const eventsRef = ref(this.db, 'eventos');
    const newEventRef = push(eventsRef); 
    return set(newEventRef, eventData); 
  }

  // Actualizar evento
  updateEvent(id: string, updatedData: any): Promise<void> {
    const eventRef = ref(this.db, 'eventos/' + id);
    return update(eventRef, updatedData); // Actualiza los datos del asistente
  }

  getEventsRealTime(): Observable<any> {
    const eventRef = ref(this.db, 'eventos');
    const eventChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const eventsWithId = Object.entries(data).map(([id, event]) => {
            if (event && typeof event === 'object') {
              return {
                id,
                ...event 
              };
            } else {
              return { id, event };
            }
          });
          observer.next(eventsWithId); 
        } else {
          observer.next([]); 
        }
      });
    });
    
    return eventChanges;  // Devolver el observable
  }
/*
  getEventsRealTimeEnCursoNow(): Observable<any> {
    const eventRef = ref(this.db, 'eventos') ;
    const eventChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
  
        if (data) {
          // Filtrar eventos con status "En curso"
          const filteredEvents = Object.entries(data)
            .map(([id, event]) => {
              // Verificar si 'event' es un objeto antes de hacer spread
              const typedEvent = event as Evento;
              if (this.isEvento(event)) {
                // Verificamos si 'asistentes' existe
                const asistentes = event.asistentes || {}; 

                return {
                  ...event,
                  id,  // Spread de las propiedades del evento
                  asistentes,     // Añadimos la propiedad de asistentes al evento
                };
              }
              return null;  // Si 'event' no es un objeto, devolver null
            })
            .filter((event): event is Evento => event !== null && 'status' in event && event.status === 'En curso'); 
  
          observer.next(filteredEvents);  // Emitir los eventos filtrados
        } else {
          observer.next([]);  // En caso de no haber datos
        }
      });
    });
  
    return eventChanges;  // Devolver el observable con los eventos filtrados
  }*/
  
  /*async obtenerEventosEnCurso(): Observable<any> {
    const eventosRef = ref(this.db, 'eventos');
    
    // Consultamos los eventos con status "En curso"
    const eventosQuery = query(eventosRef, orderByChild('status'), equalTo('En curso'));
    const snapshotEventos = await get(eventosQuery);
  
    if (snapshotEventos.exists()) {
      const eventos = snapshotEventos.val();
      
      // Para cada evento, obtener los asistentes con status "Invitado" o "Asistido"
      for (let eventoId in eventos) {
        const evento = eventos[eventoId];
        const asistentesRef = ref(this.db, `eventos/${eventoId}/asistentes`);
        
        // Consultamos los asistentes con status "Invitado" o "Asistido"
        const asistentesQuery = query(asistentesRef, 
                                      orderByChild('status'),
                                      equalTo('Invitado')); // o 'Asistido'
        
        const snapshotAsistentes = await get(asistentesQuery);
  
        if (snapshotAsistentes.exists()) {
          const asistentes = snapshotAsistentes.val();
          
          // Aquí puedes hacer lo que necesites con los asistentes obtenidos
          console.log(`Asistentes de evento ${eventoId}:`, asistentes);
          return asistentes;
        }
      }
    } else {
      console.log("No se encontraron eventos en curso.");
    } 
  }*/
  
  getEventsRealTimett(): Observable<any> {
    const eventRef = ref(this.db, 'eventos');
    const eventChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
  
        if (data) {
          // Filtrar los eventos cuyo status sea "En curso"
          const eventsWithId = Object.entries(data)
            .map(([id, event]) => {
              // Solo considerar eventos con status "En curso"
              const typedEvent = event as Evento;
              if (event && typeof event === 'object' && typedEvent.status === 'En curso') {
                // Verificamos si 'asistentes' existe
                const asistentes = typedEvent.asistentes || {}; 
                return {
                  ...event,
                  id,
                  asistentes: typedEvent.asistentes || {}  // Asegurar que 'asistentes' sea un objeto
                };
              } else {
                return null; // Si no tiene status "En curso", lo ignoramos
              }
            })
            .filter(event => event !== null);  // Filtrar los eventos nulos (no 'En curso')
  
          // Aquí se retorna el arreglo de eventos que están en curso
          observer.next(eventsWithId); 
        } else {
          observer.next([]);  // Si no hay datos
        }
      });
    });
  
    return eventChanges;  // Devolver el observable
  }
  
  // Llamar la función
  

  /*getEventsRealTimeEnCurso(): Observable<any> {
    const eventRef = ref(this.db, 'eventos');
    const eventChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
  
        if (data) {
          // Filtrar los eventos que están "En curso"
          const eventsWithId = Object.entries(data)
            .map(([id, event]) => {
              if (event && typeof event === 'object') {
                return {
                  id,
                  ...event // solo esparce si es un objeto
                };
              } else {
                // Si el evento no es un objeto, lo retornamos con su ID y el objeto vacío
                return { id, event: {} };
              }
            })
            .filter(event => event.event?.status === 'En curso');   // Filtrar por estado
  
          observer.next(eventsWithId); 
        } else {
          observer.next([]); 
        }
      });
    });
    
    return eventChanges;  // Devolver el observable
  }*/
  
  
  // Escuchar los cambios en los eventos de un evento en tiempo real
  //LA SIG FUNCION NO TRAE IDS
  /*getEventsRealTime(): Observable<any> {
    const eventRef = ref(this.db, `eventos`);
    const eventChanges = new Observable<any>((observer) => {
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
        observer.next(data);  // Emitir los datos
      });
    });
    return eventChanges;
  }*/

  //FUNCIONES PARA EVENTOS EN CURSO REAL TIME:

/*getEventseNcURSORealTime(): Observable<any> {
  const eventRef = ref(this.db, 'eventos');
  
  // Creamos el observable para obtener los eventos
  const eventChanges = new Observable<any>((observer) => {
    onValue(eventRef, async (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const eventsWithId = await Promise.all(
          Object.entries(data).map(async ([id, event]) => {
            const eventTyped = event as Event;
            if (eventTyped && eventTyped.status === 'En curso') {
            if (event && typeof event === 'object' && event.status === 'En curso') {
              
              // Obtener los asistentes para este evento
              const asistentesRef = ref(this.db, `eventos/${id}/asistentes`);
              const asistentesQueryInvitado = query(asistentesRef, orderByChild('status'), equalTo('Invitado'));
              const asistentesQueryAsistido = query(asistentesRef, orderByChild('status'), equalTo('Asistido'));

              const [snapshotInvitados, snapshotAsistidos] = await Promise.all([
                get(asistentesQueryInvitado),
                get(asistentesQueryAsistido)
              ]);
              
              const asistentesInvitados = snapshotInvitados.exists() ? snapshotInvitados.val() : {};
              const asistentesAsistidos = snapshotAsistidos.exists() ? snapshotAsistidos.val() : {};

              // Unir los asistentes "Invitado" y "Asistido"
              const asistentes = {
                ...asistentesInvitados,
                ...asistentesAsistidos
              };
              
              // Devolver el evento con los asistentes
              return {
                id,
                ...event,
                asistentes
              };
            } else {
              return null;  // Si el evento no está "En curso", no lo procesamos
            }
            }
          })
        );

        // Filtrar eventos null (si los hay)
        const filteredEvents = eventsWithId.filter(event => event !== null);

        observer.next(filteredEvents);  // Emitir los eventos con sus asistentes
      } else {
        observer.next([]);  // Si no hay datos, devolvemos un array vacío
      }
    });
  });
  
  return eventChanges;  // Devolver el observable
}*/

}
