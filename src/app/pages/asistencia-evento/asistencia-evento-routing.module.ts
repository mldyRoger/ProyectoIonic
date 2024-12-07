import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciaEventoPage } from './asistencia-evento.page';

const routes: Routes = [
  {
    path: '',
    component: AsistenciaEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciaEventoPageRoutingModule {}
