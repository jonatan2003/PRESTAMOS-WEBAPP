import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Prestamo } from '../interfaces/prestamo.interface';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  getListElectrodomesticos() {
    throw new Error('Method not implemented.');
  }
  getListVehiculos() {
    throw new Error('Method not implemented.');
  }
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/prestamos`;
  }

  getListPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }
  getPrestamosVencidos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/list/vencidos`);
  }

  getPrestamo(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  savePrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }

  updatePrestamo(id: number, prestamo: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}`, prestamo);
  }

  deletePrestamo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
