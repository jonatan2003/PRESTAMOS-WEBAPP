import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {

    this.apiUrl = `${environment.endpoint}api/v1`;
  }

  login(usuario: string, password: string): Observable<any> {
    const credentials = { usuario, password };
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}