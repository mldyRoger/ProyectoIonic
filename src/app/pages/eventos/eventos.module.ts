import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';

import { ModalEventosComponent } from "../../components/modal-eventos/modal-eventos.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventosPageRoutingModule
  ],
  declarations: [EventosPage, ModalEventosComponent]
})
export class EventosPageModule {}
