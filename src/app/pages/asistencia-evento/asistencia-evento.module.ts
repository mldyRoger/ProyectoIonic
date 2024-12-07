import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaEventoPageRoutingModule } from './asistencia-evento-routing.module';

import { AsistenciaEventoPage } from './asistencia-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaEventoPageRoutingModule
  ],
  declarations: [AsistenciaEventoPage]
})
export class AsistenciaEventoPageModule {}
