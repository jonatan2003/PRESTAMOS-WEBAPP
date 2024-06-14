import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';

@Injectable()
export class EmpleadoGuard implements CanActivate {
  empleado: Empleado;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    console.log('AuthGuard: Verificando token..');

    if (token && this.isTokenValid(token)) {
      console.log('AuthGuard: User está autenticado.');

      const role = this.authService.getUserRole();
      if (role === 'empleado') {
        console.log('AuthGuard: Usuario tiene permiso de empleado.');
        return true;
      } else {
        console.log('AuthGuard: Usuario no tiene permiso de empleado. Redirigiendo...');
        this.router.navigate(['/login']); // Redirige a la página de acceso no autorizado
        return false;
      }
    } else {
      console.log('AuthGuard: User no está autenticado. Redirecting to login page.');
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si la autenticación falla.
      return false; // No permite el acceso a la ruta protegida.
    }
  }

  private isTokenValid(token: string | null): boolean {
    if (!token) {
      console.log('AuthGuard: Token is missing.');
      return false; // No hay token, el usuario no está autenticado.
    }

    // Aquí puedes implementar la lógica para verificar la validez del token.
    // Por ejemplo, puedes verificar su fecha de vencimiento.

    // En este ejemplo, asumimos que el token es válido si existe.
    console.log('AuthGuard: Token is valid.');
    return true; // Temporalmente, asumimos que el token es válido.
  }
}
