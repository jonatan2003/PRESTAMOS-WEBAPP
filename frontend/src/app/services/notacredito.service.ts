import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { NotaCredito } from '../interfaces/notacredito.interface';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/notacreditos`;
  }

  getListNotasCredito(): Observable<NotaCredito[]> {
    return this.http.get<NotaCredito[]>(this.apiUrl);
  }

  getNotaCredito(id: number): Observable<NotaCredito> {
    return this.http.get<NotaCredito>(`${this.apiUrl}/${id}`);
  }

  saveNotaCredito(notaCredito: NotaCredito): Observable<NotaCredito> {
    return this.http.post<NotaCredito>(this.apiUrl, notaCredito);
  }

  updateNotaCredito(id: number, notaCredito: NotaCredito): Observable<NotaCredito> {
    return this.http.put<NotaCredito>(`${this.apiUrl}/${id}`, notaCredito);
  }

  deleteNotaCredito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
