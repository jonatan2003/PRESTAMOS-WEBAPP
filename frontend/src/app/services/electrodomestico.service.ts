import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Electrodomestico } from '../interfaces/electrodomestico.interface';

@Injectable({
  providedIn: 'root'
})
export class ElectrodomesticoService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/electrodomesticos`;
  }

  getListElectrodomesticos(): Observable<Electrodomestico[]> {
    return this.http.get<Electrodomestico[]>(this.apiUrl);
  }

  getUltimoElectrodomestico(): Observable<Electrodomestico[]> {
    return this.http.get<Electrodomestico[]>(`${this.apiUrl}/last/electrodomestico`);
  }


  getElectrodomestico(id: number): Observable<Electrodomestico> {
    return this.http.get<Electrodomestico>(`${this.apiUrl}/${id}`);
  }

  saveElectrodomestico(electrodomestico: Electrodomestico): Observable<Electrodomestico> {
    return this.http.post<Electrodomestico>(this.apiUrl, electrodomestico);
  }

  updateElectrodomestico(id: number, electrodomestico: Electrodomestico): Observable<Electrodomestico> {
    return this.http.put<Electrodomestico>(`${this.apiUrl}/${id}`, electrodomestico);
  }

  deleteElectrodomestico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
