import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarsepPage } from './registrarsep.page';

describe('RegistrarsepPage', () => {
  let component: RegistrarsepPage;
  let fixture: ComponentFixture<RegistrarsepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarsepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
