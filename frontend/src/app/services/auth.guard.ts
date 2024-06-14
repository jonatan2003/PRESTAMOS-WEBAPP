import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de tener un AuthService para manejar la autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return false;
    } else if (role === 'empleado') {
      this.router.navigate(['/empleado']);
      return false;
    }
    return true; // Permite la navegación a la ruta de login
  }
}
