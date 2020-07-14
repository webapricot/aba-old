import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';
import { PharmaciesService } from 'src/app/services/pharmacies.service';
import { MedicinesService } from 'src/app/services/medicines.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  words: any;

  pages: any[] = [];

  constructor(private translate: TranslateService, private pharmaciesService: PharmaciesService, private medicinesService: MedicinesService) { }

  ngOnInit() {
    this.words = this.translate.words.hy.header;
    this.pages = this.words.pages;
  }

  f() {
    console.log(`medicine_ids - ${this.pharmaciesService.pharmacies_post_data.medicine_ids}`, `pharmacy_ids - ${this.medicinesService.medicines_post_data.pharmacy_ids}`)
  }

}
