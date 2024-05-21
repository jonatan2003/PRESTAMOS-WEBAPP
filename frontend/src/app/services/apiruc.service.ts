// dni.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiRucService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/ruc`;
  }

  getClienteByDni(ruc: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${ruc}`);
  }
}
