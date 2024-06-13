import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  nombreUsuario: string;
  id_empleado: string;
  loading: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.apiUrl = `${environment.endpoint}api/v1`;
  }

  login(usuario: string, password: string): Observable<boolean> {
    const credentials = { usuario, password };

    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.toastr.success('Inicio de Sesión Exitosa', 'Éxito', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          localStorage.setItem('token', response.token);
          localStorage.setItem('permiso', response.permiso);
          localStorage.setItem('id_usuario', response.idusuario);
          localStorage.setItem('usuario', response.usuario);
          localStorage.setItem('password', response.password);
          localStorage.setItem('id_empleado', response.empleado);

          if (response.permiso === "admin") {
            window.location.href = '/admin';
          } else if (response.permiso === "empleado") {
            window.location.href = '/empleado';
          }
        } else {
          this.toastr.error('Respuesta del servidor no válida', 'Error');
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true;
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000;
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') && !this.isTokenExpired();
  }

  getUserRole(): string {
    return localStorage.getItem('permiso');
  }
}
