import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarsecPage } from './registrarsec.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarsecPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarsecPageRoutingModule {}
