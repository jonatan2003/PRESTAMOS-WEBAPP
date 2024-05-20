import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Tipo_comprobante } from '../interfaces/tipo_comprobante.interface';

@Injectable({
    providedIn: 'root'
  })export class TipocomprobanteService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/tipocomprobantes`;
    }
  
    getListTipocomprobantes(): Observable<Tipo_comprobante[]> {
      return this.http.get<Tipo_comprobante[]>(this.apiUrl);
    }
  
    getTipocomprobante(id: number): Observable<Tipo_comprobante> {
      return this.http.get<Tipo_comprobante>(`${this.apiUrl}/${id}`);
    }
  
    saveTipocomprobante(tipocomprobante: Tipo_comprobante): Observable<Tipo_comprobante> {
      return this.http.post<Tipo_comprobante>(this.apiUrl, tipocomprobante);
    }
  
    updateTipocomprobante(id: number, tipocomprobante: Tipo_comprobante): Observable<Tipo_comprobante> {
      return this.http.put<Tipo_comprobante>(`${this.apiUrl}/${id}`, tipocomprobante);
    }
  
    deleteTipocomprobante(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchTipocomprobante(searchTerm: string): Observable<Tipo_comprobante[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<Tipo_comprobante[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  