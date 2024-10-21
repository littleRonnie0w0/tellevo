import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarsepPageRoutingModule } from './registrarsep-routing.module';

import { RegistrarsepPage } from './registrarsep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarsepPageRoutingModule
  ],
  declarations: [RegistrarsepPage]
})
export class RegistrarsepPageModule {}
