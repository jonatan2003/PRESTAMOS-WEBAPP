import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { DetallePrestamo } from '../interfaces/detaprestamo.interface';

@Injectable({
  providedIn: 'root'
})
export class DetaprestamoService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/v1/detaprestamos`;
  }

  getListDetaprestamos(): Observable<DetallePrestamo[]> {
    return this.http.get<DetallePrestamo[]>(this.apiUrl);
  }

  getDetaprestamo(id: number): Observable<DetallePrestamo> {
    return this.http.get<DetallePrestamo>(`${this.apiUrl}/${id}`);
  }

  saveDetaprestamo(DetallePrestamo: DetallePrestamo): Observable<DetallePrestamo> {
    return this.http.post<DetallePrestamo>(this.apiUrl, DetallePrestamo);
  }

  updateDetaprestamo(id: number, DetallePrestamo: DetallePrestamo): Observable<DetallePrestamo> {
    return this.http.put<DetallePrestamo>(`${this.apiUrl}/${id}`, DetallePrestamo);
  }

  deleteDetaprestamo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
