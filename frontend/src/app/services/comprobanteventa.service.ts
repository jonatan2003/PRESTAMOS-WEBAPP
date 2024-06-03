import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Comprobante_venta } from '../interfaces/comprobante_venta.interface';

@Injectable({
    providedIn: 'root'
  })export class ComprobanteventaService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/comprobantes_ventas`;
    }
  
    getListComprobanteventas(): Observable<Comprobante_venta[]> {
      return this.http.get<Comprobante_venta[]>(this.apiUrl);
    }
  
    getComprobanteventa(id: number): Observable<Comprobante_venta> {
      return this.http.get<Comprobante_venta>(`${this.apiUrl}/${id}`);
    }
    getComprobanteventabyVentaID(idventa: number): Observable<Comprobante_venta> {
      return this.http.get<Comprobante_venta>(`${this.apiUrl}/venta/${idventa}`);
    }
    
  
    saveComprobanteventa(comprobanteventa: Comprobante_venta): Observable<Comprobante_venta> {
      return this.http.post<Comprobante_venta>(this.apiUrl, comprobanteventa);
    }
  
    updateComprobanteventa(id: number, comprobanteventa: Comprobante_venta): Observable<Comprobante_venta> {
      return this.http.put<Comprobante_venta>(`${this.apiUrl}/${id}`, comprobanteventa);
    }
  
    deleteComprobanteventa(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchComprobanteventa(searchTerm: string): Observable<Comprobante_venta[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<Comprobante_venta[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  