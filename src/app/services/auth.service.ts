import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signIn(obj): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, obj);
  }
}
