import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private isRequesting: boolean = false;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Asume que el token está almacenado en localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  fetchData(endpoint: string): Observable<any> {
    if (this.isRequesting) {
      console.log('Esperando a que la petición actual termine...');
      return throwError('Request already in progress');
    }

    this.isRequesting = true;
    const url = `http://localhost:3000${endpoint}`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      tap(() => {}),
      finalize(() => {
        this.isRequesting = false;
      })
    );
  }

  postData(endpoint: string, data: any): Observable<any> {
    if (this.isRequesting) {
      console.log('Esperando a que la petición actual termine...');
      return throwError('Request already in progress');
    }

    this.isRequesting = true;
    const url = `http://localhost:3000${endpoint}`;
    return this.http.post(url, data, { headers: this.getHeaders() }).pipe(
      tap(() => {}),
      finalize(() => {
        this.isRequesting = false;
      })
    );
  }
}
