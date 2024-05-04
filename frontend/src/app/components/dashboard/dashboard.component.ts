import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { ToastrService } from 'ngx-toastr';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  empleado: Empleado | null = null; // Definir la propiedad empleado
  nombreUsuario: string ;
  id_empleado: string ;
  loading: boolean = false;
  usuario:  Usuario | null = null; 
 id_usuario : string;
password: string ;

  constructor(private _empleadoService: EmpleadoService,
    private _usuariosService: UsuarioService,
    private toastr: ToastrService,
    private impresionService: ImpresionService
  ) {
    this.nombreUsuario = localStorage.getItem('usuario');
    this.id_empleado = localStorage.getItem('id_empleado');

console.log(this.nombreUsuario);

   }

  ngOnInit(): void {
    // Cargar los datos del empleado al inicializar el componente
    this.loadEmpleadoData(parseInt(this.id_empleado));
  }
  loadEmpleadoData(idEmpleado: number): void {
    this._empleadoService.getEmpleado(idEmpleado).subscribe(
      (empleado: Empleado) => {
        this.empleado = empleado;
        localStorage.setItem('nombresempleado', empleado.nombre +" "+ empleado.apellidos);
      


      },
      (error) => {
        console.error('Error al cargar datos del empleado:', error);
      }
    );
  }

  // getListUsuarios(idUsuario: number) {
  //   this.loading = true;

  //   this._usuariosService.getUsuario(idUsuario).subscribe(
  //     (usuario: Usuario) => {
  //       this.usuario= usuario;
  //       localStorage.setItem('password', usuario.password );
        
  //   })
  // }

}
