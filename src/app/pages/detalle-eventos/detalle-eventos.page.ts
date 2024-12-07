import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AttendeesService } from '../../services/attendees.service';
import { ModalController } from '@ionic/angular';
import { ModalAsistentesComponent } from "../../components/modal-asistentes/modal-asistentes.component";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import { IonModal } from '@ionic/angular'; 
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-eventos',
  templateUrl: './detalle-eventos.page.html',
  styleUrls: ['./detalle-eventos.page.scss'],
})
export class DetalleEventosPage implements OnInit {
  userData: any;
  assistants: any[] = [];
  idEvento : string = '';
  detallesEvento = { nombre: '', descripcion: '', fecha: '', status: '', user: '', asistentes:[] };
  qrData: string = '';
  public xQrCode: string = '';
  loading: HTMLIonLoadingElement | null = null;
  @ViewChild('modalQR', { static: false }) modal!: IonModal;
  constructor(private attendeesService: AttendeesService,
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController,) { 
      this.userData = this.authService.getUserDataFromToken();
    }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.idEvento = navigation.extras.state['id'];
      this.detallesEvento.nombre = navigation.extras.state['nombre'];
      this.detallesEvento.descripcion = navigation.extras.state['descripcion'];
      this.detallesEvento.fecha = navigation.extras.state['fecha'];
      this.detallesEvento.status = navigation.extras.state['status'];
    }
    this.attendeesService.getAssistantsRealTime(this.idEvento).subscribe((data) => {
      if (data) {
        this.assistants = Object.values(data);  // Transformar el objeto de datos en un array
        console.log(this.assistants);
      }
    });
  }

  async abrirModal(idEvento:string, idAsistente:string, nombre:string, correo:string, telefono:string, status:string) {
    const modal = await this.modalController.create({
      component: ModalAsistentesComponent,
      componentProps: { 
        existId: idAsistente,
        eventId: idEvento,
        nombre:nombre,
        correo:correo,
        telefono:telefono,
        status:status
       }
    });
    return await modal.present();
  }

  async generarQR(idEvento:string, idAsistente:string, asistente:string, correo:string){
  this.loading = await this.loadingController.create({
      message: 'Enviando invitación...',
      spinner: 'circles',
    });
  await this.loading.present();
  try {
    this.xQrCode = `IdEvento:${idEvento};IdAsistente:${idAsistente}`;
   await this.attendeesService.sendQR(asistente, this.detallesEvento.nombre, this.detallesEvento.descripcion, this.detallesEvento.fecha, correo, this.xQrCode).subscribe();
   const infoAsistente = { 
    status: 'Invitado'
    }
   this.attendeesService.updateAssistant(idEvento, idAsistente, infoAsistente);
    await this.openModal();
     await this.loading.dismiss();
  } catch (error) {
    // En caso de error, también ocultamos el loading
    await this.loading.dismiss();
    console.error('Error al generar el QR:', error);
  }
  
  }

  async openModal() {
    return await this.modal.present();
  }

  // Función para cerrar el modal
  closeModal(modal: IonModal) {
    modal.dismiss();
  }

}
