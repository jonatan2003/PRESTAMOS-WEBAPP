import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,  private toastr: ToastrService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    console.log('AuthGuard: Verificando token..', );

    if (token && this.isTokenValid(token)) {
      console.log('AuthGuard: User está autenticado.');

      return true; // El usuario está autenticado, permite el acceso a la ruta protegida.

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
