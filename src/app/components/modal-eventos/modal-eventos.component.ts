import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import {ModalController} from "@ionic/angular";
import { EventsService } from '../../services/events.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal-eventos',
  templateUrl: './modal-eventos.component.html',
  styleUrls: ['./modal-eventos.component.scss'],
})
export class ModalEventosComponent  implements AfterViewInit  {
  userData:any;
  @Input() existId: string = '';
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() fecha: string = '';
  @Input() status: string = '';
  @Input() user: string = '';
  idEvento : string = '';
  nuevoEvento = { nombre: '', descripcion: '', fecha: '', status: 'Planeacion', user: '', asistentes:[] };
  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private authService: AuthService,
  ) {
   
  }
  ngAfterViewInit() {
 console.log('hola modal'+this.status)
 this.userData = this.authService.getUserDataFromToken();
 this.idEvento = this.existId;
    if (this.idEvento) {
      this.nuevoEvento = { 
        nombre: this.nombre, 
        descripcion: this.descripcion, 
        fecha: this.fecha,
        status: this.status,
        user: this.user,
        asistentes:[] };
    }
    
  }
  //Registrar nuevo evento
  guardarEvento(){
    if (this.idEvento) {//Si es una actualizacion
      const updateEventoData = {
        nombre: this.nuevoEvento.nombre,
        descripcion: this.nuevoEvento.descripcion,
        fecha: this.nuevoEvento.fecha,
        status: this.nuevoEvento.status,
        user: 'noasign',
      };
      this.eventsService.updateEvent(this.idEvento,updateEventoData);
      this.modalController.dismiss(); 
    }else{//Si es un nuevo registro
      const nuevoEventoData = {
        ...this.nuevoEvento,
        user: 'noasign'
        //asistentes: {nombre: 'pedro2', correo: 'gmail.com', status: 'creado'}
      };
      this.eventsService.registerEvent(nuevoEventoData);
      this.modalController.dismiss(); 
    }
    
  }

  // Funcion para cerrar modal
  dismiss() {
    this.modalController.dismiss(); 
  }

}
