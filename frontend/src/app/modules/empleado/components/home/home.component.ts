import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nombreUsuario: string | null;

  constructor(private cd: ChangeDetectorRef, private router: Router) {
    this.nombreUsuario = localStorage.getItem('usuario');
  }

  ngOnInit() {
  }

  confirmLogout() {
    // localStorage.removeItem('token');
    // localStorage.removeItem('usuario');
    // this.nombreUsuario = null;
    // this.cd.detectChanges();
    // this.router.navigate(['/login']);

    console.log('Confirm logout called');
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performLogout();
      }
    });
  }

  performLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.nombreUsuario = null;
    this.cd.detectChanges();
    this.router.navigate(['/login']);
  }
}
