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

  nombreEmpleadoSeleccionado: string = '';
  idEmpleadoSeleccionado: number  | null = null;
  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

formempleado: FormGroup; 

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


    this.formempleado = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      fecha_nacimiento: ['', Validators.required],
      fecha_contratacion: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      correo: ['', [Validators.required, Validators.email]],
      tipo_contrato: ['', Validators.required],
      // ... Otros campos del formulario de empleado
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
    this.idEmpleadoSeleccionado = empleado.id;
    this.form.get('id_empleado').setValue(empleado.id); // Suponiendo que el objeto empleado tiene un campo 'id'
  this.empleadoSeleccionado = empleado; // Actualiza la variable empleadoSeleccionado
  this.nombreEmpleadoSeleccionado = empleado.nombre  + " " +empleado.apellidos;

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

  mostrarEmpleado() {
    // Mostrar el modal
    const modal = document.getElementById('ModalEmpleado');
    if (modal) {
      // Añadir las clases necesarias para mostrar el modal
      modal.classList.add('show');
      modal.classList.add('fade');
      modal.style.display = 'block';
  
      // Establecer el estado del modal como modal
      modal.setAttribute('aria-modal', 'true');
  
      // Agregar la clase 'modal-open' al cuerpo del documento
      document.body.classList.add('modal-open');
  
      // Crear y agregar el backdrop del modal
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop');
      backdrop.classList.add('fade');
      backdrop.classList.add('show');
      document.body.appendChild(backdrop);
    }
  }



  // addEmpleado() {
  //   const empleado: Empleado = {
  //     nombre: this.form.value.nombre,
  //     apellidos: this.form.value.apellidos,
  //     dni: this.form.value.dni,
  //     fecha_nacimiento: this.form.value.fecha_nacimiento,
  //     fecha_contratacion: this.form.value.fecha_contratacion,
  //     genero: this.form.value.genero,
  //     direccion: this.form.value.direccion,
  //     telefono: this.form.value.telefono,
  //     correo: this.form.value.correo,
  //     tipo_contrato: this.form.value.tipo_contrato,
  //     estado: "ACTIVO",
  //     // ... Otros campos del formulario de empleado según la interfaz
  //   };

  //   this.loading = true;

  //   if (this.id !== 0) {
  //     // Es editar
  //     empleado.id = this.id;
  //     this._empleadosService.updateEmpleado(this.id, empleado).subscribe(() => {
  //       this.toastr.info(`El empleado ${empleado.nombre} fue actualizado con éxito`, 'Empleado actualizado');
  //       this.loading = false;
  //       this.router.navigate(['admin/empleado-list']);        // this.router.navigate(['/empleado-list']);
  //     });
  //   } else {
  //     // Es agregar
  //     this._empleadosService.saveEmpleado(empleado).subscribe(() => {
  //       this.toastr.success(`El empleado ${empleado.nombre} fue registrado con éxito`, 'Empleado registrado');
  //       this.loading = false;
  //       this.router.navigate(['admin/empleado-list']);        // this.router.navigate(['/empleado-list']);
  //     });
  //   }
  // }


  addEmpleado() {
    const empleado: Empleado = {
      nombre: this.formempleado.value.nombre,
      apellidos: this.formempleado.value.apellidos,
      dni: this.formempleado.value.dni,
      fecha_nacimiento: this.formempleado.value.fecha_nacimiento,
      fecha_contratacion: this.formempleado.value.fecha_contratacion,
      genero: this.formempleado.value.genero,
      direccion: this.formempleado.value.direccion,
      telefono: this.formempleado.value.telefono,
      correo: this.formempleado.value.correo,
      tipo_contrato: this.formempleado.value.tipo_contrato,
      estado: "ACTIVO",
      // ... Otros campos del formulario de empleado según la interfaz
    };
  
    this.loading = true;
  
    // Es agregar
    this._empleadosService.saveEmpleado(empleado).subscribe(
      (empleadoid: Empleado) => {
        this.loading = false;
        //this.router.navigate(['admin/client-list']);
        this.idEmpleadoSeleccionado = empleadoid.id;
        this.form.get('id_empleado').setValue(this.idEmpleadoSeleccionado); // Suponiendo que el objeto empleado tiene un campo 'id'
        this.toastr.success(`El Empleado fue registrado con éxito`, 'Empleado registrado', {
          timeOut: 2000, // Duración en milisegundos (2 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right' // Posición del toastr en la pantalla
        });
        
        //this.idClienteSeleccionado = cliente.id;
        this.nombreEmpleadoSeleccionado = this.formempleado.value.nombre + " " +  this.formempleado.value.apellidos  ;
        this.guardarEmpleado();
  
      },
      (error) => {
        this.loading = false;
        console.error(error);
        if (error && error.error && error.error.msg) {
          this.toastr.error(error.error.msg, 'Error al registrar Empleado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        } else {
          this.toastr.error('Error al registrar Empleado', 'Error', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      }
    );
  }


  guardarEmpleado() {
    // Aquí iría tu lógica para guardar el formulario

    // Luego, cierra el modal
    const modal = document.getElementById('ModalEmpleado');
    if (modal) {
      // Eliminar todas las clases de Bootstrap que controlan la visualización del modal
      modal.classList.remove('show');
      modal.classList.remove('fade');
      modal.classList.remove('show');
      modal.classList.remove('showing');
      
      // Ocultar el modal
      modal.style.display = 'none';
      
      // Restablecer el estado del modal
      modal.setAttribute('aria-modal', 'false');
      
      // Eliminar la clase 'modal-open' del cuerpo del documento
      document.body.classList.remove('modal-open');
      
      // Eliminar el backdrop del modal
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  }

}
