import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ManufacturersAffectiveMaterialsService {

  constructor(private http: HttpClient) { }

  manufacturerCreate(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/manufacturer/create`, {data: obj});
  }

  affectiveMaterialCreate(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/affectiveMaterial/create`, {data: obj})
  }
}
