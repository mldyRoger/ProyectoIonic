import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: '_',
    pathMatch: 'full'
  },
  {
    path: '_',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/split-pane/split-pane.module').then( m => m.SplitPanePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'queries',
    loadChildren: () => import('./pages/queries/queries.module').then( m => m.QueriesPageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./pages/camera/camera.module').then( m => m.CameraPageModule)
  },
  {
    path: 'asistentes',
    loadChildren: () => import('./pages/asistentes/asistentes.module').then( m => m.AsistentesPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'detalle-eventos',
    loadChildren: () => import('./pages/detalle-eventos/detalle-eventos.module').then( m => m.DetalleEventosPageModule)
  },
  {
    path: 'asistencia-evento',
    loadChildren: () => import('./pages/asistencia-evento/asistencia-evento.module').then( m => m.AsistenciaEventoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
