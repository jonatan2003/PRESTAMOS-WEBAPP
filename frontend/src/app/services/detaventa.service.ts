import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { DetalleVenta } from '../interfaces/detaventa.interface';

@Injectable({
  providedIn: 'root'
})
export class DetaventaService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/detaventas`;
  }

  getListDetaventas(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(this.apiUrl);
  }

  getDetaventa(id: number): Observable<DetalleVenta> {
    return this.http.get<DetalleVenta>(`${this.apiUrl}/${id}`);
  }
  getDetaventabyIdVenta(idventa: number): Observable<DetalleVenta> {
    return this.http.get<DetalleVenta>(`${this.apiUrl}/venta/${idventa}`);
  }

  saveDetaventa(DetalleVenta: DetalleVenta[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, DetalleVenta);
  }

  updateDetaventa(id: number, DetalleVenta: DetalleVenta): Observable<DetalleVenta> {
    return this.http.put<DetalleVenta>(`${this.apiUrl}/${id}`, DetalleVenta);
  }

  deleteDetaventa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
