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
import { DetalleVenta } from '../interfaces/detaventa.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Electrodomestico } from '../interfaces/electrodomestico.interface';
import { Vehiculo } from '../interfaces/vehiculo.interface';
import { Pago } from '../interfaces/pago.interface';
import { Comprobante_venta } from '../interfaces/comprobante_venta.interface';
import { CronogramaPago } from '../interfaces/cronograma_pagos.interface';
@Injectable({
  providedIn: 'root'
})
export class PaginacionService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/paginacion`;
  }
  getListCronogramaPagos(page: number, pageSize: number): Observable<CronogramaPago[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<CronogramaPago[]>(`${this.apiUrl}/cronograma_pagos`,{ params });
  }

  getListComprobanteventas(page: number, pageSize: number): Observable<Comprobante_venta[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Comprobante_venta[]>(`${this.apiUrl}/comprobantes_ventas`,{ params });
  }

  getListClientes(page: number, pageSize: number): Observable<Cliente[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`,{ params });
  }
  getListEmpleados(page: number, pageSize: number): Observable<Empleado[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`,{ params });
  }
  getListArticulos(page: number, pageSize: number, categoriaid: number): Observable<Articulo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Articulo[]>(`${this.apiUrl}/articulos/${categoriaid}`,{ params });
  }
  
  getListPrestamos(page: number, pageSize: number): Observable<Prestamo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Prestamo[]>(`${this.apiUrl}/ticketsprestamos`,{ params });
  }
 
  getListPrestamosVencidos(page: number, pageSize: number): Observable<Prestamo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Prestamo[]>(`${this.apiUrl}/ticketsventas`,{ params });
  }
  getListPrestamosVentas(page: number, pageSize: number): Observable<Prestamo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Prestamo[]>(`${this.apiUrl}/prestamosventas`,{ params });
  }
  getListPrestamosPendientes(page: number, pageSize: number): Observable<Prestamo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Prestamo[]>(`${this.apiUrl}/tprestamospendientes`,{ params });
  }
  getListPrestamosPagados(page: number, pageSize: number): Observable<Prestamo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Prestamo[]>(`${this.apiUrl}/prestamospagados`,{ params });
  }
  
  getListCategorias(page: number, pageSize: number): Observable<Categoria[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`,{ params });
  }
  getListElectrodomesticos(page: number, pageSize: number): Observable<Electrodomestico[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Electrodomestico[]>(`${this.apiUrl}/electrodomesticos`,{ params });
  }
  getListVehiculos(page: number, pageSize: number): Observable<Vehiculo[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/vehiculos`,{ params });
  }
  getListPagos(page: number, pageSize: number): Observable<Pago[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Pago[]>(`${this.apiUrl}/ticketspagos`,{ params });
  }
  getListVentas(page: number, pageSize: number): Observable<Venta[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas`,{ params });
  }
  getListDetaVentas(page: number, pageSize: number): Observable<DetalleVenta[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/detalleventas`,{ params });
  }
  getListUsuarios(page: number, pageSize: number): Observable<Usuario[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`,{ params });
  }

}
