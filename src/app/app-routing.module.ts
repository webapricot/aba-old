import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicinesPharmaciesModule } from './medicines-pharmacies/medicines-pharmacies.module';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => AuthModule },
  { path: 'home', loadChildren: () => MedicinesPharmaciesModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
