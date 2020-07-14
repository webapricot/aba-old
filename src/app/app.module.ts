import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MedicinesPharmaciesModule } from './medicines-pharmacies/medicines-pharmacies.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MedicinesPharmaciesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
