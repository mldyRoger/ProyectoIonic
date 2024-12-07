import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciaEventoPage } from './asistencia-evento.page';

describe('AsistenciaEventoPage', () => {
  let component: AsistenciaEventoPage;
  let fixture: ComponentFixture<AsistenciaEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
