import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarsecPageRoutingModule } from './registrarsec-routing.module';

import { RegistrarsecPage } from './registrarsec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarsecPageRoutingModule
  ],
  declarations: [RegistrarsecPage]
})
export class RegistrarsecPageModule {}
