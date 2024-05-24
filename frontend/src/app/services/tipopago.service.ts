import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { TipoPago } from '../interfaces/tipo_pago.interface';

@Injectable({
    providedIn: 'root'
  })
  export class TipopagoService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/tipopagos`;
    }
  
    getListTipopagos(): Observable<TipoPago[]> {
      return this.http.get<TipoPago[]>(this.apiUrl);
    }
  
    getTipopago(id: number): Observable<TipoPago> {
      return this.http.get<TipoPago>(`${this.apiUrl}/${id}`);
    }
  
    saveTipopago(tipopago: TipoPago): Observable<TipoPago> {
      return this.http.post<TipoPago>(this.apiUrl, tipopago);
    }
  
    updateTipopago(id: number, tipopago: TipoPago): Observable<TipoPago> {
      return this.http.put<TipoPago>(`${this.apiUrl}/${id}`, tipopago);
    }
  
    deleteTipopago(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchTipopago(searchTerm: string): Observable<TipoPago[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<TipoPago[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  