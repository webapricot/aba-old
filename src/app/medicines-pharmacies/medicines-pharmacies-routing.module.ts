import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', component: HeaderComponent, pathMatch: 'full' },
  { path: 'test', component: TestComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicinesPharmaciesRoutingModule { }
