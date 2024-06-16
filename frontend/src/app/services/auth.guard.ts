import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getUserRole();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'empleado') {
      this.router.navigate(['/empleado']);
    }
    return true;
  }
}
