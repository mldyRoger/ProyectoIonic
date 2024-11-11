import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueriesPage } from './queries.page';

describe('QueriesPage', () => {
  let component: QueriesPage;
  let fixture: ComponentFixture<QueriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QueriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
