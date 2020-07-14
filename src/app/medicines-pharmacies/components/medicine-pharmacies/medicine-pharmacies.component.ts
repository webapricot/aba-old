import { Component, OnInit, ElementRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TranslateService } from 'src/app/services/translate.service';
import { Medicine } from 'src/app/interfaces/medicine';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MedicinesService } from 'src/app/services/medicines.service';
import { PharmaciesService } from 'src/app/services/pharmacies.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-medicine-pharmacies',
  templateUrl: './medicine-pharmacies.component.html',
  styleUrls: ['./medicine-pharmacies.component.scss']
})
export class MedicinePharmaciesComponent implements OnInit  {
  words :any;
  pharmacies: any[];
  medicine: Medicine;
  selectedPharmacies: any[] = [];
  medicine_pharamcies_form: FormGroup;
  pharamaciesFormArray: FormArray = this.fb.array([]);

  post_medicine_pharmacies: any = {};

  loading = true;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private translate: TranslateService,
              private fb: FormBuilder,
              private medicineService: MedicinesService,
              private pharmaciesService: PharmaciesService,
              private datePipe: DatePipe) { }
  
  ngOnInit(): void {
    this.words = this.translate.words.hy.medicines_pharmacies;

    this.medicine_pharamcies_form = this.fb.group({
      _pharmacies: this.pharamaciesFormArray
    });

    this.medicine = this.config.data.medicine;
    this.medicine.pharmacies.forEach(item => {
      this.post_medicine_pharmacies[item.id] = {
        [item.pivot.pharmacy_id] : {last_checked_date: item.pivot.last_checked_date, available: true},
      };
    });
    this.medicinePharmaciesIndex();
  }

  medicinePharmaciesIndex() {
    this.medicineService.medicinePharmacies(this.medicine.id).subscribe(res => {
      this.pharmacies = res;
      this.pharmacies.forEach(pharmacy => {
        if (pharmacy.medicines[0]) {
          this.pharamaciesFormArray.push(this.pharmacyForm(true, pharmacy.medicines[0].pivot.last_checked_date, true));
        } else {
          this.pharamaciesFormArray.push(this.pharmacyForm(false, '', false));
        }
      });
      this.loading = false;
    });
  }

  pharmacyForm(bool, date, isAvailable) {
    return this.fb.group({
      id: [bool, []],
      lastCheckedDate: [date, [Validators.required]],
      available: isAvailable
    });
  }

  onInputChange(pharmacy_id, group: any, e: any = {}) {
    if (e.checked) {
      this.post_medicine_pharmacies[pharmacy_id] = {
        [pharmacy_id]: {last_checked_date: group.value.lastCheckedDate, available: group.value.available}
      };
    } else if(e.checked === false) {
      this.post_medicine_pharmacies[pharmacy_id] = {
        [pharmacy_id]: {last_checked_date: group.value.lastCheckedDate, available: false}
      };
    }
  }

  onCheckboxChanged(pharmacy_id, group: any) {
    group.get('lastCheckedDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  }

  medicinePharmaciesSave() {
    this.pharmaciesService.medicinePharmaciesUpdate({
      medicine_id: this.medicine.id,
      data: Object.values(this.post_medicine_pharmacies)
    }).subscribe(res => {
      console.log(res)
    });
  }

  onSearchInputChange(e: InputEvent) {
    const searchValue = e.target['value'];
    if (searchValue.length >= 3) {
      this.loading = true;
      // this.pharamaciesFormArray = this.fb.array([]);
      this.pharmaciesService.medicinePharmaciesSearch({medicine_id: this.medicine.id, data: searchValue}).subscribe(res => {
        this.pharmacies = res;
        this.loading = false;
        /* this.pharmacies.forEach(pharmacy => {
          if (pharmacy.medicines[0]) {
            this.pharamaciesFormArray[pharmacy.id] = this.pharmacyForm(true, pharmacy.medicines[0].pivot.last_checked_date);
          } else {
            this.pharamaciesFormArray[pharmacy.id] = this.pharmacyForm(false, '');
          }
        }); */
      });
    } else if (searchValue.length === 0) {
      this.loading = true;
      this.pharmacies = [];
      this.medicinePharmaciesIndex();
    }
  }

  f() {
    console.log(Object.values(this.post_medicine_pharmacies))
  }
}
