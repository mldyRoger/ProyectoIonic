import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../services/actividad.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  actividades: any[] = [];
  user: any;
  constructor(private actividadService: ActividadService) { }

  ngOnInit(): void {
    this.actividadService.getPerfil().subscribe(
      response => {
        console.log('Respuesta del servicio:', response);
        this.actividades = response.actividades;
        this.user = response.user;
      },
      error => {
        console.error('Error al obtener el perfil', error);
      }
    );
  }
  toggleDarkMode = () => {
    document.documentElement.classList.toggle('ion-palette-dark');
  }

}
