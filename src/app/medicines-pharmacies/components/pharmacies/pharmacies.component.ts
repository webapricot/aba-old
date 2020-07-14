import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Pharmacy } from 'src/app/interfaces/pharmacy';
import { PharmacyType } from 'src/app/interfaces/pharmacy-type';
import { TranslateService } from 'src/app/services/translate.service';
import { PharmaciesService } from 'src/app/services/pharmacies.service';
import { TableDataModel } from 'src/app/models/table-data.model';
import { PharmacyWorkTime } from 'src/app/interfaces/pharmacy-work-time';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MedicinesService } from 'src/app/services/medicines.service';

const tableData = new TableDataModel();

@Component({
  selector: 'app-pharmacies',
  templateUrl: './pharmacies.component.html',
  styleUrls: ['./pharmacies.component.scss']
})
export class PharmaciesComponent implements OnInit {

  @ViewChild('table') table: Table;

  words: any;

  createRow = false;
  editRow = false;
  data: {
    pharmacies: Array<Pharmacy>,
    pharmacy_types: Array<PharmacyType>,
    locations: Array<Location>,
    work_times: Array<PharmacyWorkTime>
  } = {
    pharmacies: [],
    pharmacy_types: [],
    locations: [],
    work_times: []
  };

  loading = true;
  totalRecords: number;
  clonedPharmacies: {[id: number]: Pharmacy} = {};
  clonedSortFilterData: any = {};
  filters: any = {};
  filtersObj: any = {};

  cols: Array<{field: string, header: string, inputType: any, filterField?: any, sortField?: string, editInputType: any, dataField: any, editableDataField?: any}> = [
    { field: 'name', header: 'Անվանում', inputType: 'text', filterField: 'title', sortField: 'title', dataField: 'title', editInputType: 'text' },
    { field: 'locations', header: 'Քաղաք / Մարզ', inputType: 'multiselect', filterField: 'location_id', sortField: 'sortCountries', dataField: 'location', editInputType: 'select' },
    { field: 'address', header: 'Հասցե', inputType: 'text', filterField: 'address', sortField: 'address', dataField: 'address', editInputType: 'text' },
    { field: 'phone', header: 'Հեռախոս', inputType: 'text', filterField: 'phone', editInputType: 'text', dataField: 'phone' },
    { field: 'work_times', header: 'Աշխատանքային ժամեր', inputType: 'multiselect', filterField: 'pharmacy_work_time_id', editInputType: 'select', dataField: 'pharmacy_work_time' },
    { field: 'pharmacy_types', header: 'Տարբերանշան', inputType: 'multiselect', filterField: 'pharmacy_types', editInputType: 'multiselect', dataField: '_pharmacy_types', editableDataField: 'pharmacy_types' },
  ];

  constructor(private translate: TranslateService,
              private pharmaciesService: PharmaciesService,
              private messageService: MessageService,
              private medicinesService: MedicinesService) { }

  ngOnInit(): void {
    this.words = this.translate.words.hy.medicines_pharmacies;
    
    this.pharmaciesService.tableDataShow().subscribe(res => {
      this.data.pharmacy_types = tableData.setTableData(res.pharmacy_types);
      this.data.locations = tableData.setTableData(res.locations);
      this.data.work_times = tableData.setTableData(res.work_times);
      this.loading = true;
      this.pharmaciesService.pharmaciesShow().subscribe(_res => {
        this.loading = false;
        this.pharmaciesShowInit(_res);
        console.log(this.data)
      });
    });

    this.pharmaciesService.pharmaciesFilterByMedicine.subscribe(res => {
      if (res.length !== 0) {
        if (this.medicinesService.has_filtered_medicines) {
          this.pharmaciesService.pharmacies_post_data.medicine_ids = res;
        }
        this.loading = true;
        this.pharmaciesService.pharmaciesShow().subscribe(_res => {
          this.loading = false;
          this.pharmaciesShow(_res);
          console.log(this.data)
        });
      }
    });
  }

  pharmaciesShowInit(response: any) {
    this.data.pharmacies = response.pharmacies.data;
    this.totalRecords = response.pharmacies.total;
    
    this.medicinesService.medicines_post_data.pharmacy_ids = [];

    this.data.pharmacies.forEach(pharmacy => {
      pharmacy = this.setPharmaciesTemplateData(pharmacy);
    });
    
    this.loading = false;
  }

  pharmaciesShow(response: any) {
    this.data.pharmacies = response.pharmacies.data;
    this.totalRecords = response.pharmacies.total;
    
    this.medicinesService.medicines_post_data.filter_data = {};
    this.medicinesService.medicines_post_data.sort_data = {
      sortOrder: '',
      sortField: ''
    };

    this.filters.pharmacy_ids = [];
    this.data.pharmacies.forEach(pharmacy => {
      pharmacy = this.setPharmaciesTemplateData(pharmacy);
      this.filters.pharmacy_ids.push(pharmacy.id);
      if (this.pharmaciesService.has_filtered_pharmacies) { 
        this.medicinesService.medicines_post_data.pharmacy_ids.push(pharmacy.id);
      }
    });
    this.loading = false;
    this.medicinesService.medicinesFilterByPharmacies.next(this.medicinesService.medicines_post_data.pharmacy_ids);
  }

  setPharmaciesTemplateData(pharmacy: Pharmacy): any {
    pharmacy.location = tableData.setUniqueTableData(pharmacy.location, this.data.locations);
    pharmacy.pharmacy_work_time = tableData.setUniqueTableData(pharmacy.pharmacy_work_time, this.data.work_times);
    pharmacy._pharmacy_types = tableData.setMultiselectShowData(pharmacy.pharmacy_types);
    pharmacy.pharmacy_types = tableData.setMultiselectTableData(pharmacy.pharmacy_types, this.data.pharmacy_types);
    pharmacy.title = tableData.setUniqueTableData(pharmacy.title);
    pharmacy.address = tableData.setUniqueTableData(pharmacy.address);
    pharmacy.phone = tableData.setUniqueTableData(pharmacy.phone);

    return pharmacy;
  }

  addNewRow() {
    if (!this.createRow) {
      this.data.pharmacies.unshift({
        title: {
          label: '',
          value: {}
        },
        location_id: null,
        address: {
          label: '',
          value: null
        },
        phone: {
          label: '',
          value: null
        },
        pharmacy_work_time_id: null,
        pharmacy_types: [],
        _pharmacy_types: [],
        location: {
          label: '',
          value: null
        },
        pharmacy_work_time: {
          label: '',
          value: null
        }
      });
      setTimeout(() => {
        const newRowEditInitElems = document.getElementsByClassName('rowEditInitPharmacy');
        newRowEditInitElems[0].dispatchEvent(new Event('click', {cancelable: true}));
      }, 0);
    }
    this.createRow = true;
  }

  loadPharmacies(event: any) {
    if (event.sortOrder !== this.clonedSortFilterData.sortOrder || event.sortField !== this.clonedSortFilterData.sortField) {
      event.first = 0;
    }
    const pageableData = {
      page: Math.floor(event.first / 10) + 1,
      size: event.rows
    };
    this.clonedSortFilterData = this.deepCopyFunction(event);
    this.pharmaciesService.pharmacies_sort_pageableData = pageableData;
    this.pharmaciesService.pharmacies_post_data.sort_data.sortOrder = event.sortOrder;
    this.pharmaciesService.pharmacies_post_data.sort_data.sortField = event.sortField;
    this.loading = true;
    this.pharmaciesService.pharmaciesShow().subscribe(res => {
      console.log(res)
      this.loading = false;
      if (Object.keys(this.filtersObj).length === 0 && this.filtersObj.constructor === Object && Object.keys(this.filters).length === 0 && this.filters.constructor === Object) {
        this.pharmaciesShowInit(res);
      } else {
        this.pharmaciesShow(res);
      }
    });
  }

  onMultiselectChange(pharmacy) {
    const tableData = new TableDataModel();
    pharmacy._pharmacy_types = tableData.setMultiselectShowData(pharmacy.pharmacy_types);
    console.log(pharmacy)
  }

  onSelectChange(field, pharmacy) {
    pharmacy[field].label = pharmacy[field].value.name ? pharmacy[field].value.name : pharmacy[field].value.title;
    if (pharmacy.hasOwnProperty(`${field}_id`)) {
      pharmacy[`${field}_id`] = pharmacy[field].value.id;
    }
  }

  onRowEditInit(pharmacy) {
    this.createRow = true;
    this.editRow = true;
    this.clonedPharmacies[pharmacy.id] = this.deepCopyFunction(pharmacy);
  }

  onRowEditCancel(pharmacy, ind) {
    if (!pharmacy.id) {
      this.data.pharmacies.shift();
    } else {
      this.data.pharmacies[ind] = this.clonedPharmacies[pharmacy.id];
      delete this.clonedPharmacies[pharmacy.id];
    }
    this.createRow = false;
    this.editRow = false;
  }

  onRowEditSave(pharmacy) {
    if (pharmacy.id) {
      if (this.editRow) {
        this.pharmaciesService.pharmacyEdit(pharmacy).subscribe(res => {
          delete this.clonedPharmacies[pharmacy.id];
          this.messageService.add({severity:'success', detail:'Ձեր տվյալները հաջողությամբ թարմեցված են'});
        });
      } else {
        alert('error');
      }
    } else {
      if(this.checkPharmacyValidation(pharmacy)) {
        this.pharmaciesService.pharmacyCreate(pharmacy).subscribe(res => {
          this.messageService.add({severity:'success', detail:'Դեղատունը հաջողությամբ ստեղծված է'});
          this.data.pharmacies[0].id = res.id;
        });
      } else {
        alert('error')
      }
    }
    this.editRow = false;
    this.createRow = false;
  }

  deepCopyFunction(inObject: any) {
    let outObject: any, value: any, key: any;

    if (typeof inObject !== 'object' || inObject === null) {
      return inObject;
    }

    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      if (value instanceof Date) {
        outObject[key] = value;
        continue;
      }

      outObject[key] = this.deepCopyFunction(value);      
    }

    return outObject;
  }

  onFilterValueChange(value: any, field: any) {
    this.filters[field] = this.makePharmacyFilterData(value);
    this.pharmaciesService.pharmacies_post_data.filter_data = this.filters;

    if (field === 'title' || field === 'address' || field === 'phone') {
      if (value.length >= 3) {
        this.loading = true;
        this.pharmaciesService.pharmaciesShow().subscribe(res => {
          this.loading = false;
          this.pharmaciesShow(res);
        });      
      } else {
        this.loading = true;
        delete this.filters[field];
        this.pharmaciesService.pharmacies_post_data.filter_data = this.filters;
        this.pharmaciesService.pharmaciesShow().subscribe(res => {
          this.loading = false;
          this.pharmaciesShow(res);
        });   
      }
    }
  }

  makePharmacyFilterData(items: any) {
    if (Array.isArray(items)) {
      const returnesArrayOfIds = [];
      items.forEach(item => {
        returnesArrayOfIds.push(item.id);
      });
      return returnesArrayOfIds;
    }
    return items;
  }

  filterGLobal() {
    this.loading = true;
    this.pharmaciesService.has_filtered_pharmacies = true;
    this.pharmaciesService.pharmaciesShow().subscribe(res => {
      this.loading = false;
      this.pharmaciesShow(res);
    });
  }

  resetForms() {
    this.pharmaciesService.has_filtered_pharmacies = false;
    this.filtersObj = {};
    this.filters = {};
    this.pharmaciesService.pharmacies_post_data.filter_data = this.filters;
    this.pharmaciesService.pharmacies_post_data.medicine_ids = [];
    this.table.reset();
  }

  checkPharmacyValidation(pharmacy: Pharmacy): boolean {
    return pharmacy.title.label !== '' && pharmacy.address.label !== '' && pharmacy.phone.label !== '' && !!pharmacy.location.value && !!pharmacy.pharmacy_work_time.value && pharmacy.pharmacy_types.length !== 0;
  }

}
