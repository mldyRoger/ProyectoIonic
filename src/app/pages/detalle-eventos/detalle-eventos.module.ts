import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleEventosPageRoutingModule } from './detalle-eventos-routing.module';

import { DetalleEventosPage } from './detalle-eventos.page';

import { ModalAsistentesComponent } from "../../components/modal-asistentes/modal-asistentes.component";

import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleEventosPageRoutingModule,
    QRCodeModule
  ],
  declarations: [DetalleEventosPage, ModalAsistentesComponent]
})
export class DetalleEventosPageModule {}
