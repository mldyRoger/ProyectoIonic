import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      {
        path: '',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('../eventos/eventos.module').then( m => m.EventosPageModule)
      },
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
export class SplitPanePageRoutingModule {}
