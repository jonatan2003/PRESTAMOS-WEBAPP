import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent {
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda

  empleados: Empleado[] = [];
  listEmpleados: Empleado[] = []
  empleadoSeleccionado: Empleado;
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

   
  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0


  constructor(private fb: FormBuilder,
    private _usuariosService: UsuarioService,
    private _empleadosService: EmpleadoService,
    private searchService: SearchService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      id_empleado: ['', Validators.required ,],
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      permiso: ['', Validators.required],
      // ... Otros campos del formulario de usuario
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar';
      this.getUsuario(this.id);
    }

    this.getListEmpleados() ;

  }

  getListEmpleados() {
    this.loading = true;

    this._empleadosService.getListEmpleados().subscribe((data: Empleado[]) => {
      this.listEmpleados = data;
      this.loading = false;
    })
  }


buscarEmpleados() {
  this.loading = true; // Establecer loading en true para mostrar la carga

this.searchService.searchEmpleados( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
  (response: any) => {
    this.empleados = response.data; // Asignar los datos de empleados a la propiedad empleados
    this.currentPage = response.page; // Actualizar currentPage con el número de página actual
    this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
    this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
    this.loading = false; // Establecer loading en false al finalizar la carga
  },
  error => {
    console.error('Error al buscar empleado:', error);
    this.loading = false; // Manejar el error y establecer loading en false
  }
);
}


// Método para cambiar de página
pageChanged(page: number) {
  this.currentPage = page;
  this.buscarEmpleados();
}

// Método para generar las páginas disponibles
getPages(): number[] {
  // Retorna un array de números enteros del 1 al totalPages
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

  seleccionarEmpleado(empleado: Empleado) {
    //  this.empleadoSeleccionado = empleado.nombre;
    //    this.form.controls['empleado'].setValue(empleado.nombre);
    this.form.get('id_empleado').setValue(empleado.id); // Suponiendo que el objeto empleado tiene un campo 'id'
  this.empleadoSeleccionado = empleado; // Actualiza la variable empleadoSeleccionado

      }
  getUsuario(id: number) {
    this.loading = true;
    this._usuariosService.getUsuario(id).subscribe((data: Usuario) => { // Corregido a 'Usuario'
      this.loading = false;
      this.form.setValue({
        usuario: data.usuario,
        password: data.password,
        permiso: data.permiso,
        // ... Otros campos del formulario de usuario según la interfaz
      });
    });
  }



  addUsuario() {
    const usuario: Usuario = {
      id_empleado: this.form.value.id_empleado,
      usuario: this.form.value.usuario,
      password: this.form.value.password,
      permiso: this.form.value.permiso,
      // ... Otros campos del formulario de usuario según la interfaz
    };

    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      usuario.id = this.id;
      this._usuariosService.updateUsuario(this.id, usuario).subscribe(() => {
        this.toastr.info(`El usuario ${usuario.usuario} fue actualizado con éxito`, 'usuario actualizado');
        this.loading = false;
        this.router.navigate(['/admin/user-list']);
      });
    } else {
      // Es agregar
      this._usuariosService.saveUsuario(usuario).subscribe(() => {
        this.toastr.success(`El usuario ${usuario.usuario} fue registrado con éxito`, 'usuario registrado');
        this.loading = false;
        this.router.navigate(['/admin/user-list']);
      });
    }
  }

  


}
