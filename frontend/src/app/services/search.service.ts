import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Cliente } from '../interfaces/cliente.interface';
import { Empleado } from '../interfaces/empleado.interface';
import { Articulo } from '../interfaces/articulo.interface';
import { Prestamo } from '../interfaces/prestamo.interface';
import { Categoria } from '../interfaces/categoria.interface';
import { Venta } from '../interfaces/venta.interface';
import { Pago } from '../interfaces/pago.interface';
import { DetalleVenta } from '../interfaces/detaventa.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { CronogramaPago } from '../interfaces/cronograma_pagos.interface';
import { Inventario } from '../interfaces/inventario.interface';
import { Ticket } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/search`;
  }


  searchClientes(page: number, pageSize: number,searchTerm: string): Observable<Cliente[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/searchTerm=`, { params });
  }

  searchEmpleados(page: number, pageSize: number,searchTerm: string): Observable<Empleado[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados/searchTerm=`, { params });
  }

  searchArticulos(page: number, pageSize: number,searchTerm: string): Observable<Articulo[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos/searchTerm=`, { params });
  }

  searchInventario(page: number, pageSize: number,searchTerm: string): Observable<Inventario[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Inventario[]>(`${this.apiUrl}/inventario/searchTerm=`, { params });
  }

  searchPrestamos(page: number, pageSize: number,searchTerm: string): Observable<Ticket[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Ticket[]>(`${this.apiUrl}/ticketsprestamos/searchTerm=`, { params });
  }
  searchCronogramaPagos(page: number, pageSize: number,searchTerm: string): Observable<CronogramaPago[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<CronogramaPago[]>(`${this.apiUrl}/cronograma_pagos/searchTerm=`, { params });
  }
  
  searchCategorias(page: number, pageSize: number,searchTerm: string): Observable<Categoria[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias/searchTerm=`, { params });
  }
  searchVentas(page: number, pageSize: number,searchTerm: string): Observable<Venta[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas/searchTerm=`, { params });
  }
  searchPagos(page: number, pageSize: number,searchTerm: string): Observable<Pago[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Pago[]>(`${this.apiUrl}/pagos/searchTerm=`, { params });
  }
  searchDetaVentas(page: number, pageSize: number,searchTerm: string): Observable<DetalleVenta[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/detaventas/searchTerm=`, { params });
  }

  searchUsuarios(page: number, pageSize: number,searchTerm: string): Observable<Usuario[]> {
    const params = new HttpParams().set('searchTerm', searchTerm)
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
    ;
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/searchTerm=`, { params });
  }
}
