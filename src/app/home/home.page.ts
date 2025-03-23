import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  actividades: any[] = [];
  email: string = 'usuario@example.com';
  constructor() {}
  ngOnInit() {
   
  }

}
