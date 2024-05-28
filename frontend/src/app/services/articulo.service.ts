

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Articulo } from '../interfaces/articulo.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/articulos`;
  }

  addArticulo(articulo: Articulo): Observable<Articulo> {
    return this.http.post<Articulo>(this.apiUrl, articulo);
  }

  getListArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.apiUrl);
  }
  getListArticulosVehiculos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/list/Vehiculos`);
  }
  getListArticulosElectrodomesticos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.apiUrl}/list/Electrodomesticos`);
  }
  getArticulo(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/${id}`);
  }

  saveArticulo(articulo: Articulo): Observable<Articulo> {
    return this.http.post<Articulo>(this.apiUrl, articulo);
  }

  updateArticulo(id: number, articulo: Articulo): Observable<Articulo> {
    return this.http.put<Articulo>(`${this.apiUrl}/${id}`, articulo);
  }
  updateArticuloEstado(id: number, articulo: Partial<Articulo>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, articulo);
  }

  deleteArticulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
