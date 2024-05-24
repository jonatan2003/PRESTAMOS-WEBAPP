import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Tipo_serie } from '../interfaces/tipo_serie.interface';

@Injectable({
    providedIn: 'root'
  })export class TiposerieService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/tiposeries`;
    }
  
    getListTiposeries(): Observable<Tipo_serie[]> {
      return this.http.get<Tipo_serie[]>(this.apiUrl);
    }
  
    getTiposerie(id: number): Observable<Tipo_serie> {
      return this.http.get<Tipo_serie>(`${this.apiUrl}/${id}`);
    }
  
    saveTiposerie(tiposerie: Tipo_serie): Observable<Tipo_serie> {
      return this.http.post<Tipo_serie>(this.apiUrl, tiposerie);
    }
  
    updateTiposerie(id: number, tiposerie: Tipo_serie): Observable<Tipo_serie> {
      return this.http.put<Tipo_serie>(`${this.apiUrl}/${id}`, tiposerie);
    }
  
    deleteTiposerie(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchTiposerie(searchTerm: string): Observable<Tipo_serie[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<Tipo_serie[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  