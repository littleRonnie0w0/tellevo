import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarsecPage } from './registrarsec.page';

describe('RegistrarsecPage', () => {
  let component: RegistrarsecPage;
  let fixture: ComponentFixture<RegistrarsecPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarsecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
