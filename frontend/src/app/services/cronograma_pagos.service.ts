import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { CronogramaPago } from '../interfaces/cronograma_pagos.interface';

@Injectable({
  providedIn: 'root'
})
export class CronogramaPagosService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/cronograma_pagos`;
  }

  createCronogramaPago(cronogramaPago: CronogramaPago): Observable<CronogramaPago> {
    return this.http.post<CronogramaPago>(this.apiUrl, cronogramaPago);
  }

  getCronogramaPagos(): Observable<CronogramaPago[]> {
    return this.http.get<CronogramaPago[]>(this.apiUrl);
  }

  getCronogramaPagosByIdPrestamo(idPrestamo: number): Observable<CronogramaPago[]> {
    const params = new HttpParams().set('id_prestamo', idPrestamo.toString());
    return this.http.get<CronogramaPago[]>(`${this.apiUrl}/idprestamo`, { params });
  }

  updateCronogramaPago(id: number, cronogramaPago: CronogramaPago): Observable<CronogramaPago> {
    return this.http.put<CronogramaPago>(`${this.apiUrl}/${id}`, cronogramaPago);
  }

  deleteCronogramaPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
