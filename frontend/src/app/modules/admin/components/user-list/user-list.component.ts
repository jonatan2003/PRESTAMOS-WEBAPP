import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  form: FormGroup;
  id: number;
  id_usuario : string ;
id_empleado: string ;
nombreuser: string;
permiso : string;
selectedUsuario: Usuario | null = null;
  listUsuarios: Usuario[] = []
  loading: boolean = false;


  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor(private _usuariosService: UsuarioService,
    private _paginacionService: PaginacionService,
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
    this.getListUsuarios();
  }
  getListUsuarios() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._paginacionService.getListUsuarios(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listUsuarios = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
      console.log(this.listUsuarios);
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
      this.totalPages = response.totalPages;
    });
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListUsuarios();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }




  setSelectedUsuario(usuario: Usuario) {
    this.selectedUsuario= usuario;
  
      // Establecer los valores del cliente seleccionado en el formulario
      this.form.patchValue({
        usuario: localStorage.getItem("usuario"),
        permiso: localStorage.getItem("permiso")       
      });

      // Resetear el estado de validación del formulario y establecer formularioModificado a false
      this.form.markAsUntouched();
this.mostrarModal();
      console.log('Estado del formulario:', this.form.valid);
   
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

  mostrarModal() {
    // Mostrar el modal
    const modal = document.getElementById('ModalUsuario');
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


  guardar() {
    // Aquí iría tu lógica para guardar el formulario
    
    // Luego, cierra el modal
    const modal = document.getElementById('ModalUsuario');
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


  
  deleteUsuario(id: number) {
    // Mostrar confirmación antes de eliminar el usuario
    Swal.fire({
      title: 'Eliminar Usuario',
      text: '¿Estás seguro de que deseas eliminar este Usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeleteUsuario(id);
      }
    });
  }

  performDeleteUsuario(id: number) {
    this.loading = true;
    this._usuariosService.deleteUsuario(id).subscribe(() => {
      this.getListUsuarios();
      this.toastr.warning('El Usuario fue eliminado con exito', 'Usuario eliminado');
    })
  }




  // constructor(private impresionService: ImpresionService) { }

  onImprimir() {
    const entidad = 'Usuarios'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Usuarios'; // Título del informe
    this.impresionService.imprimir(entidad, encabezado, cuerpo, titulo, true); // Llama al servicio de impresión
  }

  // Método para obtener el encabezado de la tabla
  getEncabezado(): string[] {
    const encabezado: string[] = [];
    document.querySelectorAll('table thead th').forEach((th: HTMLTableHeaderCellElement) => {
      const texto = th.textContent.trim();
      if (texto !== 'ACTUALIZAR' && texto !== 'ELIMINAR' && texto !== 'IMPRIMIR') {
        encabezado.push(texto);
      }
    });
    return encabezado;
  }

  // Método para obtener el cuerpo de la tabla
  getCuerpo(): string[][] {
    const cuerpo: string[][] = [];
    document.querySelectorAll('table tbody tr').forEach((tr: HTMLTableRowElement) => {
      const fila: string[] = [];
      tr.querySelectorAll('td').forEach((td: HTMLTableCellElement) => {
        const texto = td.textContent.trim();
        if (texto !== 'Actualizar' && texto !== 'Eliminar' && texto !== 'Imprimir') {
          fila.push(texto);
        }
      });
      cuerpo.push(fila);
    });
    return cuerpo;
  }



}
