import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MedicinesPharmaciesRoutingModule } from './medicines-pharmacies-routing.module';
import { HeaderComponent } from './components/header/header.component';

import { AccordionModule } from 'primeng/accordion';     // accordion and accordion tab
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { MedicinesComponent } from './components/medicines/medicines.component';
import { TestComponent } from './components/test/test.component';
import { PharmaciesComponent } from './components/pharmacies/pharmacies.component';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MedicinePharmaciesComponent } from './components/medicine-pharmacies/medicine-pharmacies.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [HeaderComponent, MedicinesComponent, TestComponent, PharmaciesComponent, MedicinePharmaciesComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MedicinesPharmaciesRoutingModule,
    AccordionModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    DialogModule,
    InputTextareaModule,
    CheckboxModule,
    VirtualScrollerModule,
    DynamicDialogModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [
    {
      provide: 'virtual-scroller-default-options', useValue: {
      checkResizeInterval: 1000,
      // modifyOverflowStyleOfParentScroll: true,
      // resizeBypassRefreshThreshold: 5,
      // scrollAnimationTime: 750,
      // scrollDebounceTime: 0,
      // scrollThrottlingTime: 0,
      // stripedTable: false
    },
   },
   DialogService,
   MessageService,
   DatePipe
  ],
  entryComponents: [MedicinePharmaciesComponent]
})
export class MedicinesPharmaciesModule { }
