import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ToastrService } from 'ngx-toastr';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild ,ElementRef} from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent {
  form: FormGroup;
  id: number;
id_usuario : string ;
id_empleado: string ;
  listUsuarios: Usuario[] = []
  loading: boolean = false;
  usuarioSeleccionado: Usuario | null = null;
  selectedUsuario: Usuario | null = null;
nombreuser: string;
permiso : string;

  constructor(private _usuariosService: UsuarioService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private router: Router,
     private aRouter: ActivatedRoute,
     private impresionService: ImpresionService) { 

      this.form = this.fb.group({
        id_empleado: ['', ],
        usuario: ['', Validators.required],
        password_actual: ['', Validators.required],
        password_nueva: ['', Validators.required],
        permiso: ['', Validators.required],
        // ... Otros campos del formulario de usuario
      });
      this.id = Number(aRouter.snapshot.paramMap.get('id'));
      this.id_usuario = localStorage.getItem("id_usuario");
      this.id_empleado = localStorage.getItem("id_empleado");
        this.nombreuser = localStorage.getItem("usuario");
        this.permiso =  localStorage.getItem("permiso"); 


    }
    


  ngOnInit(): void {
    this.rellenar();

  }

rellenar(){
  this.form.patchValue({
    usuario: localStorage.getItem("usuario"),
    permiso: localStorage.getItem("permiso")
  });

  // Resetear el estado de validación del formulario y establecer formularioModificado a false
  this.form.markAsUntouched();
}



updateUsuario() {
  const empleadoId = parseInt(this.id_empleado);
  const usuarioid = parseInt(this.id_usuario);
 

  const data = {
    id: usuarioid,
    usuario: this.form.value.usuario,
    password_actual: this.form.value.password_actual,
    password_nueva: this.form.value.password_nueva,
    permiso: this.form.value.permiso,
    // Agrega aquí más datos según los requerimientos del backend
  };


  if (usuarioid !== 0) {
    this.loading = true;

    this._usuariosService.updateUsuario(usuarioid, data).subscribe(() => {
      this.toastr.info(`El usuario ${data.usuario} fue actualizado con éxito`, 'Usuario actualizado', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
      this.loading = false;
      this.router.navigateByUrl("admin/user-list");
      console.log('Usuario actualizado con éxito');
    }, error => {
      this.toastr.error('Contraseña Incorrecta', 'Error');
      this.loading = false;
    });
  } else {
    console.log('ID del usuario no válido:', usuarioid);
    this.toastr.error('ERROR CONTRASEÑA INCORRECTA', 'Error');
  }
}


}
