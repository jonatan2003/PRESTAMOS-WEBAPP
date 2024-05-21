import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { TipoComprobante } from '../interfaces/tipo_comprobante.interface';

@Injectable({
    providedIn: 'root'
  })export class TipocomprobanteService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/tipocomprobantes`;
    }
  
    getListTipocomprobantes(): Observable<TipoComprobante[]> {
      return this.http.get<TipoComprobante[]>(this.apiUrl);
    }
  
    getTipocomprobante(id: number): Observable<TipoComprobante> {
      return this.http.get<TipoComprobante>(`${this.apiUrl}/${id}`);
    }
  
    saveTipocomprobante(tipocomprobante: TipoComprobante): Observable<TipoComprobante> {
      return this.http.post<TipoComprobante>(this.apiUrl, tipocomprobante);
    }
  
    updateTipocomprobante(id: number, tipocomprobante: TipoComprobante): Observable<TipoComprobante> {
      return this.http.put<TipoComprobante>(`${this.apiUrl}/${id}`, tipocomprobante);
    }
  
    deleteTipocomprobante(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchTipocomprobante(searchTerm: string): Observable<TipoComprobante[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<TipoComprobante[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  