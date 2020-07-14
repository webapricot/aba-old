import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {

  medicines_sort_event: any = {
    sortOrder: '',
    sortField: ''
  };
  medicines_sort_pageableData: any = {
    page: 1
  };
  medicines_post_data = {
    sort_data: this.medicines_sort_event,
    filter_data: {},
    pharmacy_ids: []
  };

  medicinesFilterByPharmacies = new Subject<any>();
  has_filtered_medicines = false;

  constructor(private http: HttpClient) { }

  medicinesShow(): Observable<any> {
    return this.http.post<any>(`${API_URL}/medicines/list?page=${this.medicines_sort_pageableData.page}`, this.medicines_post_data);
  }

  getAllMedicines(): Observable<any> {
    return this.http.get<any>(`${API_URL}/medicines/get`);
  }

  tableDataShow(): Observable<any> {
    return this.http.get<any>(`${API_URL}/medicines/index`);
  }

  medicineEdit(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/medicine/update`, obj);
  }

  medicineCreate(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/medicine/store`, obj);
  }

  medicinePharmacies(medicine_id: number): Observable<any> {
    return this.http.get(`${API_URL}/medicine/${medicine_id}/pharmacies`);
  }

}
