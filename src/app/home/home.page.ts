import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../services/actividad.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  actividades: any[] = [];
  email: string = 'usuario@example.com';
  constructor(private actividadService: ActividadService) {}
  ngOnInit() {
   
  }

}
