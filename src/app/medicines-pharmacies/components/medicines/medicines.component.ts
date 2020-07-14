/* tslint:disable */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';
import { MedicinesService } from 'src/app/services/medicines.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Medicine } from 'src/app/interfaces/medicine';
import { AffectiveMaterial } from 'src/app/interfaces/affective-material';
import { License } from 'src/app/interfaces/license';
import { Location } from 'src/app/interfaces/location';
import { Manufacturer } from 'src/app/interfaces/manufacturer';
import { TableDataModel } from 'src/app/models/table-data.model';
import { ManufacturersAffectiveMaterialsService } from 'src/app/services/manufacturers-affective-materials.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MedicinePharmaciesComponent } from '../medicine-pharmacies/medicine-pharmacies.component';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PharmaciesService } from 'src/app/services/pharmacies.service';

const tableData = new TableDataModel();

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss']
})
export class MedicinesComponent implements OnInit {

  @ViewChild('calendar') calendar: any;
  @ViewChild('medicinePharmacy') medicine_pharmacies: ElementRef;
  @ViewChild('table') table: Table;

  createRow = false;
  editRow = false;
  words: any;
  data: {
    medicines: Array<Medicine>,
    affectiveMaterials: Array<AffectiveMaterial>,
    licenses: Array<License>,
    countries: Array<Location>,
    manufacturers: Array<Manufacturer>,
    medicineTypes: Array<any>,
    pharmacies: Array<any>
  } = {
    medicines: [],
    affectiveMaterials: [],
    licenses: [],
    countries: [],
    manufacturers: [],
    medicineTypes: [],
    pharmacies: []
  };
  totalRecords: number;
  loading = true;
  editing = false;
  clonedMedicines: {[id: number]: Medicine} = {};
  clonedSortFilterData: any = {};
  filters: any = {};
  filtersObj: any = {};

  manufacturerFormGroup: FormGroup;
  affectiveMaterialFormGroup: FormGroup;
  showManufacturerCreateModal = false;
  showAffectiveMaterialCreateModal = false;
  showPharmaciesModal = false;

  show_medicine_pharmacies = false;

  cols: Array<{field: string, sortField?: string, filterField?: string, header: string, inputType: any, editInputType: any, label?: any, dataField: any, editableDataField?: any}> = [
    { field: 'name', sortField: 'title', filterField: 'title', header: 'Անվանում', inputType: 'text', editInputType: 'text', dataField: 'title'},
    { field: 'manufacturers', sortField: 'sortManufacturers', filterField: 'manufacturer_id', header: 'Արտադրող', inputType: 'multiselect', editInputType: 'select', label: 'name', dataField: 'manufacturer' },
    { field: 'countries', sortField: 'sortCountries', filterField: 'location_id', header: 'Երկիր', inputType: 'multiselect', editInputType: 'select', label: 'title', dataField: 'location' },
    { field: 'licenses', sortField: 'sortLicenses', filterField: 'license_id', header: 'Լիցենզիա', inputType: 'multiselect', editInputType: 'select', label: 'title', dataField: 'license' },
    { field: 'expiration_date', sortField: 'expiration_date', filterField: 'expiration_date', header: 'Ժամկետ', inputType: 'date', editInputType: 'date', dataField: 'expiration_date' },
    { field: 'affectiveMaterials', header: 'Ազդող նյութ', filterField: 'affective_materials', inputType: 'multiselect', editInputType: 'multiselect', label: 'title', dataField: '_affective_materials', editableDataField: 'affective_materials' },
    { field: 'medicineTypes', header: 'Դեղի տեսակ', filterField: 'medicine_type_id', inputType: 'multiselect', editInputType: 'select', label: 'title', dataField: 'medicine_type' },
    { field: 'pharmacies', header: 'Դեղատներ', filterField: '', inputType: '', editInputType: 'custom', dataField: '', editableDataField: 'pharmacies' },
  ];

  constructor(private translate: TranslateService,
              private medicinesService: MedicinesService,
              private fb: FormBuilder,
              private manufacturerAffectiveMaterialService: ManufacturersAffectiveMaterialsService,
              public dialogService: DialogService,
              private messageService: MessageService,
              private pharmaciesService: PharmaciesService) { }

  ngOnInit() {
    this.manufacturerFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      description: ''
    });
    this.affectiveMaterialFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: ''
    });
    this.medicinesService.tableDataShow().subscribe(res => {
      this.data.medicineTypes = tableData.setTableData(res.medicineTypes);
      this.data.countries = tableData.setTableData(res.locations);
      this.data.licenses = tableData.setTableData(res.licenses);
      this.data.manufacturers = tableData.setTableData(res.manufacturers);
      this.data.affectiveMaterials = tableData.setTableData(res.affectiveMaterials);
      this.data.pharmacies = tableData.setTableData(res.pharmacies);
      this.medicinesService.medicinesShow().subscribe(res => {
        this.medicinesShowInit(res);
      });
    });

    this.medicinesService.medicinesFilterByPharmacies.subscribe(res => {
      if (res.length !== 0) {


        // Pharmacies filter by medicine
        /* if (this.pharmaciesService.has_filtered_pharmacies) {
          this.medicinesService.medicines_post_data.pharmacy_ids = res;
        } */
          this.loading = true;
          this.medicinesService.medicinesShow().subscribe(_res => {
            this.loading = false;
            this.medicinesShow(_res);
            console.log(this.data)
          });
      }
    });
    // Set medicines properties for template
    this.words = this.translate.words.hy.medicines_pharmacies;
  }

  medicinesShowInit(response: any) {
    this.data.medicines = response.medicines.data;
    this.totalRecords = response.medicines.total;
    

    // Pharmacies filter by medicine
    // this.pharmaciesService.pharmacies_post_data.medicine_ids = [];
    this.data.medicines.forEach(medicine => {
      medicine = this.setMedicinesTemplateData(medicine);
    });
    this.loading = false;
  }

  medicinesShow(response: any) {
    this.data.medicines = response.medicines.data;
    this.totalRecords = response.medicines.total;

    // Pharmacies filter by medicine
    /* this.pharmaciesService.pharmacies_post_data.medicine_ids = [];
    this.filters.medicine_ids = []; */
    this.pharmaciesService.pharmacies_post_data.filter_data = {};
    this.pharmaciesService.pharmacies_post_data.sort_data = {
      sortOrder: '',
      sortField: ''
    };
    this.data.medicines.forEach(medicine => {
      medicine = this.setMedicinesTemplateData(medicine);


      // Pharmacies filter by medicines
      /* this.filters.medicine_ids.push(medicine.id);
      if (this.medicinesService.has_filtered_medicines) {
        this.pharmaciesService.pharmacies_post_data.medicine_ids.push(medicine.id);
      } */
    });
    this.loading = false;


    // Pharmacies filter by medicine
    // this.pharmaciesService.pharmaciesFilterByMedicine.next(this.pharmaciesService.pharmacies_post_data.medicine_ids);
    console.log(this.data)
  }

  setMedicinesTemplateData(medicine: Medicine): any {
    medicine.license = tableData.setUniqueTableData(medicine.license, this.data.licenses);
    medicine.location = tableData.setUniqueTableData(medicine.location, this.data.countries);
    medicine.manufacturer = tableData.setUniqueTableData(medicine.manufacturer, this.data.manufacturers);
    medicine.medicine_type = tableData.setUniqueTableData(medicine.medicine_type, this.data.medicineTypes);
    medicine.title = tableData.setUniqueTableData(medicine.title);
    medicine._affective_materials = tableData.setMultiselectShowData(medicine.affective_materials);
    medicine.affective_materials = tableData.setMultiselectTableData(medicine.affective_materials, this.data.affectiveMaterials);
    medicine.expiration_date = new Date(medicine.expiration_date);
    medicine.medicine_pharmacies = {};
    return medicine;
  }

  onRowEditInit(medicine) {
    this.editRow = true;
    this.createRow = true;
    this.clonedMedicines[medicine.id] = this.deepCopyFunction(medicine);
  }

  onRowEditSave(medicine) {
    if (medicine.id) {
      if (this.editRow && medicine.title.label && medicine.manufacturer.label && medicine.location.label && medicine.license.label && medicine.medicine_type.label) {
        this.medicinesService.medicineEdit(medicine).subscribe(res => {
          delete this.clonedMedicines[medicine.id];
          this.messageService.add({severity:'success', detail:'Ձեր տվյալները հաջողությամբ թարմեցված են'});
        });
      } else {
        alert('error')
      }
    } else {
      this.medicinesService.medicineCreate(medicine).subscribe(res => {
        this.messageService.add({severity:'success', detail:'Դեղը հաջողությամբ ստեղծված է'});
        this.data.medicines[0].id = res.id;
        console.log(this.data.medicines)        
      });
    }
    this.editRow = false;
    this.createRow = false;
  }

  onRowEditCancel(medicine, ind) {
    if (!medicine.id) {
      this.data.medicines.shift();
    } else {
      this.data.medicines[ind] = this.clonedMedicines[medicine.id];
      delete this.clonedMedicines[medicine.id];
    }
    this.createRow = false;
    this.editRow = false;
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

  onSelectChange(field, medicine) {
    medicine[field].label = medicine[field].value.name ? medicine[field].value.name : medicine[field].value.title;
    if (medicine.hasOwnProperty(`${field}_id`)) {
      medicine[`${field}_id`] = medicine[field].value.id;
    }
  }

  onMultiselectChange(medicine) {
    const tableData = new TableDataModel();
    medicine._affective_materials = tableData.setMultiselectShowData(medicine.affective_materials);
  }

  onExpirationDateChanged(medicine: Medicine) {
    medicine.expiration_date = new Date(medicine.expiration_date);
  }

  addNewRow() {
    if (!this.createRow) {
      this.data.medicines.unshift({
        title: {
          label: '',
          value: {}
        },
        medicine_type_id: null,
        license_id: null,
        location_id: null,
        manufacturer_id: null,
        expiration_date: null,
        affective_materials: [],
        license: {
          label: '',
          value: null
        },
        location: {
          label: '',
          value: null
        },
        manufacturer: {
          label: '',
          value: null
        },
        medicine_type: {
          label: '',
          value: null
        },
        _affective_materials: [],
        pharmacies: []
      });
      setTimeout(() => {
        const newRowEditInitElems = document.getElementsByClassName('rowEditInit');
        newRowEditInitElems[0].dispatchEvent(new Event('click', {cancelable: true}));
      }, 0);
    }
    this.createRow = true;
  }

  loadMedicines(event: any) {
    if (event.sortOrder !== this.clonedSortFilterData.sortOrder || event.sortField !== this.clonedSortFilterData.sortField) {
      event.first = 0;
    }
    const pageableData = {
      page: Math.floor(event.first / 10) + 1,
      size: event.rows
    };
    this.clonedSortFilterData = this.deepCopyFunction(event);
    this.medicinesService.medicines_sort_pageableData = pageableData;
    this.medicinesService.medicines_post_data.sort_data.sortOrder = event.sortOrder;
    this.medicinesService.medicines_post_data.sort_data.sortField = event.sortField;
    this.loading = true;
    this.medicinesService.medicinesShow().subscribe(res => {
      this.loading = false;
      if (Object.keys(this.filtersObj).length === 0 && this.filtersObj.constructor === Object && Object.keys(this.filters).length === 0 && this.filters.constructor === Object) {
        this.medicinesShowInit(res);
      } else {
        this.medicinesShow(res);
      }
    });
  }

  onFilterValueChange(value: any, field: any) {
    this.filters[field] = this.makeMedicineFilterData(value);
    this.medicinesService.medicines_post_data.filter_data = this.filters;

    if (field === 'title') {
      if (value.length >= 3) {
        this.loading = true;
        this.medicinesService.medicinesShow().subscribe(res => {
          this.loading = false;
          this.medicinesShow(res);
        });
      } else if (value.length === 0) {
        this.loading = true;
        delete this.filters[field];
        this.medicinesService.medicines_post_data.filter_data = this.filters;
        this.medicinesService.medicinesShow().subscribe(res => {
          console.log(this.filters)
          this.loading = false;
          this.medicinesShow(res);
        });
      }
    }
  }

  makeMedicineFilterData(items: any) {
      if (Array.isArray(items)) {
        const returnesArrayOfIds = [];
        items.forEach(item => {
          returnesArrayOfIds.push(item.id);
        });
        return returnesArrayOfIds;
      }
      return items;
  }

  openMedicinePharmacies(medicine: Medicine) {
    const ref = this.dialogService.open(MedicinePharmaciesComponent, {
      data: {
        pharmacies: this.data.pharmacies,
        medicine: medicine
      },
      header: 'Դեղատներ',
      width: '70%',
      height: '70vh'
    });
  }

  closePharmacies() {
    this.show_medicine_pharmacies = false;
  }

  filterGLobal() {
    this.loading = true;
    this.medicinesService.medicinesShow().subscribe(res => {
      this.loading = false;

      // Pharmacies filter by medicine
      // this.medicinesService.has_filtered_medicines = true;
      this.medicinesShow(res);
    });
  }

  addItem(field: string) {
    switch (field) {
      case 'manufacturers':
        this.showManufacturerCreateModal = true;
        break;
      case 'affectiveMaterials':
        this.showAffectiveMaterialCreateModal = true;
    }
  }

  manufacturerSave() {
    const data = this.manufacturerFormGroup.value;
    this.manufacturerAffectiveMaterialService.manufacturerCreate(data).subscribe(res => {
      if (res) {
        this.manufacturerFormGroup.reset();
        this.data.manufacturers.push(tableData.setCreatedItemTableData(res.manufacturer));
        console.log(res)
      }
    });
  }

  affectiveMaterialSave() {
    const data = this.affectiveMaterialFormGroup.value;
    this.manufacturerAffectiveMaterialService.affectiveMaterialCreate(data).subscribe(res => {
      if (res) {
        this.affectiveMaterialFormGroup.reset();
        this.data.affectiveMaterials.push(tableData.setCreatedItemTableData(res.affective_material));
        console.log(res)
      }
    });
  }

  exportExcel() {
    // import('xlsx').then(xlsx => {
    //   this.medicinesService.getAllMedicines().subscribe(res => {
    //     console.log(res)
        // const worksheet = xlsx.utils.json_to_sheet(res);
        // const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        // const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   });
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
  //   import("file-saver").then(FileSaver => {
  //     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //     let EXCEL_EXTENSION = '.xlsx';
  //     const data: Blob = new Blob([buffer], {
  //         type: EXCEL_TYPE
  //     });
  //     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // });
  }

  resetForms() {

    // Pharmacies filter by medicine
    /* this.medicinesService.has_filtered_medicines = false;
    this.medicinesService.medicines_post_data.pharmacy_ids = []; */
    this.filtersObj = {};
    this.filters = {};
    this.medicinesService.medicines_post_data.filter_data = this.filters;
    this.table.reset();

  }

  showMedicinePharmacies(medicine: Medicine) {
    if (!medicine.show_pharmacies) {
      medicine.show_pharmacies = false;
    }
    medicine.show_pharmacies = !medicine.show_pharmacies;
  }

  showPharmaciesByMedicine(medicine_ids: number[]) {
    this.pharmaciesService.pharmaciesFilterByMedicine.next(medicine_ids);
  }

}
