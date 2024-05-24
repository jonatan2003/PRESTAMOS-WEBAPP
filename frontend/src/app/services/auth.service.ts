import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../enviroments/environment';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  nombreUsuario: string ;
  id_empleado: string ;
  empleado: Empleado ; // Cambio en el tipo de empleado y asignación inicial
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router,private _empleadoService: EmpleadoService,  private toastr: ToastrService) {

    this.apiUrl = `${environment.endpoint}api/v1`;
  }



  login(usuario: string, password: string): Observable<boolean> {
    const credentials = { usuario, password };
  
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) { 
          this.toastr.success('Inicio de Sesión Exitosa', 'Éxito', {
            timeOut: 5000, // Duración en milisegundos (3 segundos en este caso)
            progressBar: true, // Muestra la barra de progreso
            progressAnimation: 'increasing', // Animación de la barra de progreso
            positionClass: 'toast-top-right' // Posición del toastr en la pantalla
          });

          localStorage.setItem('token', response.token);
          localStorage.setItem('permiso', response.permiso);
          localStorage.setItem('id_usuario', response.idusuario);
          localStorage.setItem('usuario', response.usuario);
          localStorage.setItem('password', response.password);
          localStorage.setItem('id_empleado', response.empleado);
         
                console.log('usuario es ', usuario);

                if(response.permiso === "admin") {
                  window.location.href = 'admin';

                      }else if(response.permiso === "empleado") {
                        // this.router.navigate(['/inicio']);
                        window.location.href = 'empleado';
                      }

        

          console.log('AuthService: Token almacenado en el localStorage:');
        } else {



          console.log('AuthService: Respuesta del servidor:', response);


        }
      })
    );
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('AuthService: Obteniendo token del localStorage...', );
    return token;
  }


  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true; // Si no hay token, se considera como expirado
    }

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Multiplicado por 1000 para convertir a milisegundos
    const currentTime = new Date().getTime();

    return currentTime > expirationTime; // Devuelve true si el token ha expirado
  }


  
}
