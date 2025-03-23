import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosPage } from './eventos.page';

const routes: Routes = [
  {
    path: '',
    component: EventosPage,
    children: [
  {
    path: 'detalle-eventos',
    loadChildren: () => import('../detalle-eventos/detalle-eventos.module').then( m => m.DetalleEventosPageModule)
  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
