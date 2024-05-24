import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AdminGuard implements CanActivate {
  permiso: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.permiso = localStorage.getItem('permiso');
  }

  canActivate(): boolean {
    const token = this.authService.getToken();
    console.log('AdminGuard: Verificando token..');

    if (token && this.isTokenValid(token)) {
      console.log('AdminGuard: Usuario autenticado.');

      // Verificar el tipo de permiso
      if (this.permiso === 'admin') {
        console.log('AdminGuard: Permisos de administrador.');
        return true; // Permitir acceso a las partes para administradores
      } else {
        console.log('AdminGuard: Permiso no válido para administradores. Redirigiendo...');
        this.router.navigate(['/login']); // Redirigir a la página de acceso no autorizado si el permiso es incorrecto
        return false; // Denegar acceso
      }
    } else {
      console.log('AdminGuard: Usuario no autenticado. Redirigiendo a la página de inicio de sesión.');
      this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión si no está autenticado
      return false; // Denegar acceso
    }
  }

  private isTokenValid(token: string | null): boolean {
    if (!token) {
      console.log('AdminGuard: Token ausente.');
      return false; // No hay token, el usuario no está autenticado
    }

    // Implementa la lógica de verificación del token aquí si es necesario
    console.log('AdminGuard: Token válido.');
    return true; // Temporalmente, asumimos que el token es válido
  }
}
