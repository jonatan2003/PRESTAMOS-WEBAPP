import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css' ]


})
export class SesionComponent {
  loginForm: FormGroup;
  private token: string | null = null; // Propiedad para almacenar el token

  hidePassword: boolean = true;


  constructor(private authService: AuthService,
     private formBuilder: FormBuilder,
         private toastr: ToastrService,
     private router: Router) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm !== null) {
      const formData = this.loginForm.value;

      const usuario = formData.usuario;
      const password = formData.password;


      if (usuario && password) {
        this.authService.login(usuario, password).subscribe(
          (response:any) => {
            console.log('Logeo Exitoso');
         

        },
          (error) => {
            if (error.status === 404) {
              this.toastr.warning('Nombre de usuario incorrecto', 'Advertencia', {

                timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
                progressBar: true, // Muestra la barra de progreso
                progressAnimation: 'increasing', // Animación de la barra de progreso
                positionClass: 'toast-top-right'
                }); // Posición del toastr en la pantalla
              console.error('Nombre de usuario incorrecto');
            } else if (error.status === 401) {
              // La contraseña es incorrecta, muestra la alerta
              this.toastr.warning('Nombre de usuario incorrecto', 'Advertencia', {

                timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
                progressBar: true, // Muestra la barra de progreso
                progressAnimation: 'increasing', // Animación de la barra de progreso
                positionClass: 'toast-top-right'
                }); // Posición del toastr en la pantalla

            } else {
              console.error('Error inesperado:', error);
            }
          }
        );
      }
    }
  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
}

}
