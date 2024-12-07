import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import {ModalController} from "@ionic/angular";
import { AttendeesService } from '../../services/attendees.service';

@Component({
  selector: 'app-modal-asistentes',
  templateUrl: './modal-asistentes.component.html',
  styleUrls: ['./modal-asistentes.component.scss'],
})
export class ModalAsistentesComponent  implements AfterViewInit {
  @Input() existId: string = '';
  @Input() eventId: string = '';
  @Input() nombre: string = '';
  @Input() correo: string = '';
  @Input() telefono: string = '';
  @Input() status: string = '';
  idAsistente : string = '';
  idEvento : string = '';
  infoAsistente = { nombre: '', correo: '', telefono: '', status: 'Creado'};
  constructor(
    private modalController: ModalController,
    private attendeesService: AttendeesService
  ) {
   
  }
  ngAfterViewInit() {
 this.idAsistente = this.existId;
 this.idEvento = this.eventId;
    if (this.idAsistente) {
      this.infoAsistente = { 
        nombre: this.nombre, 
        correo: this.correo, 
        telefono: this.telefono,
        status: this.status
    }
  }
  }
  //Registrar nuevo evento
  guardarAsistente(){
    if (this.idAsistente) {//Si es una actualizacion
      this.attendeesService.updateAssistant(this.idEvento, this.idAsistente, this.infoAsistente);
      this.modalController.dismiss(); 
    }else{//Si es un nuevo registro
      const nuevoAsistenteData = {
        ...this.infoAsistente
      };
      this.attendeesService.registerAssistant(this.idEvento, this.infoAsistente);
      this.modalController.dismiss(); 
    }
    
  }

  // Funcion para cerrar modal
  dismiss() {
    this.modalController.dismiss(); 
  }

}
