import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { ModalController } from '@ionic/angular';
import { ModalEventosComponent } from "../../components/modal-eventos/modal-eventos.component";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  userData: any;
  events: any[] = [];
  constructor(private eventsService: EventsService,
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router,) { 
      this.userData = this.authService.getUserDataFromToken();
    }

  ngOnInit() {
    this.eventsService.getEventsRealTime().subscribe((data) => {
      if (data) {
        this.events = Object.values(data);  // Transformar el objeto de datos en un array
        console.log(this.events);
      }
    });
  }

  async abrirModal(idEvento:string, nombre:string, descripcion:string, fecha:string, status:string, user:string) {
    const modal = await this.modalController.create({
      component: ModalEventosComponent,
      componentProps: { 
        existId: idEvento,
        nombre:nombre,
        descripcion:descripcion,
        fecha:fecha,
        status:status,
        user:user
       }
    });
    return await modal.present();
  }

  goToDetalleEventosPage(id:string, nombre:string, descripcion:string, fecha:string, status:string, user:string) {
      // Usar state para pasar ambos valores
      this.router.navigate(['_/detalle-eventos'], {
        state: {
          id: id,
          nombre: nombre,
          descripcion: descripcion,
          fecha: fecha, 
          status: status,
          user: user 
        }
      });
  }

}
