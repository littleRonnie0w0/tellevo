import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarsepPage } from './registrarsep.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarsepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarsepPageRoutingModule {}
