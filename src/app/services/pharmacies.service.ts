import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PharmaciesService {

  pharmacies_sort_event: any = {
    sortOrder: '',
    sortField: ''
  };
  pharmacies_sort_pageableData: any = {
    page: 1
  };
  pharmacies_post_data = {
    sort_data: this.pharmacies_sort_event,
    filter_data: {},
    medicine_ids: []
  };

  pharmaciesFilterByMedicine = new Subject<any>();
  has_filtered_pharmacies = false;

  constructor(private http: HttpClient) { }
  
  pharmaciesShow() {
    return this.http.post<any>(`${API_URL}/pharmacies/list?page=${this.pharmacies_sort_pageableData.page}`, this.pharmacies_post_data);
  }

  tableDataShow(): Observable<any> {
    return this.http.get<any>(`${API_URL}/pharmacies/index`);
  }

  pharmacyEdit(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/pharmacy/update`, obj);
  }

  pharmacyCreate(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/pharmacy/store`, obj);
  }

  medicinePharmaciesUpdate(obj: any): Observable<any> {
    return this.http.post(`${API_URL}/medicine/pharmacies/update`, obj);
  }

  medicinePharmaciesSearch(obj: any): Observable<any> {
    return this.http.post(`${API_URL}/medicine/pharmacies/search`, obj);
  }
}
