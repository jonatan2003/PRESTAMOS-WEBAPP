import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';


@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.css']
})
export class EmpleadoListComponent {
  form: FormGroup;
  id: number;
  empleadoSeleccionado: Empleado | null = null;
  selectedEmpleado: Empleado | null = null;

  listEmpleados: Empleado[] = []
  loading: boolean = false;

// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor(private _empleadoService: EmpleadoService, 
    private _paginacionService: PaginacionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
    private impresionService: ImpresionService,
    ) { 

    this.form = this.fb.group({
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
    this.getListEmpleados();
  }

  getListEmpleados() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._paginacionService.getListEmpleados(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listEmpleados = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
      this.totalPages = response.totalPages;
    });
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListEmpleados();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  setSelectedEmpleado(empleado: Empleado) {
    this.selectedEmpleado = empleado;
  
   
      this.id = empleado.id;
      // Establecer los valores del cliente seleccionado en el formulario
      this.form.patchValue({
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        dni: empleado.dni,
        fecha_nacimiento: empleado.fecha_nacimiento,
        fecha_contratacion: empleado.fecha_contratacion,
        genero: empleado.genero,
        direccion: empleado.direccion,
        telefono: empleado.telefono,
        correo: empleado.correo,
        tipo_contrato: empleado.tipo_contrato
      });
  
      // Resetear el estado de validación del formulario
      this.form.markAsUntouched();
      this.mostrarModal();
      console.log('Estado del formulario:', this.form.valid);
   
  }

  updateEmpleado() {
    const empleado: Empleado = {
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos,
      dni: this.form.value.dni,
      fecha_nacimiento: this.form.value.fecha_nacimiento,
      fecha_contratacion: this.form.value.fecha_contratacion,
      genero: this.form.value.genero,
      direccion: this.form.value.direccion,
      telefono: this.form.value.telefono,
      correo: this.form.value.correo,
      tipo_contrato: this.form.value.tipo_contrato
    };
  
    console.log('Empleado a actualizar:', empleado); // Agregar registro de cliente a actualizar
  
    if (this.id !== 0) {
      console.log('ID del empleado a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar
  
      this.loading = true;
  
      empleado.id = this.id;
      this._empleadoService.updateEmpleado(this.id, empleado).subscribe(() => {
        this.toastr.info(`El empleado ${empleado.nombre} fue actualizado con éxito`, 'empleado actualizado' ,
        {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
        
        this.loading = false;
        this.getListEmpleados();
  
        console.log('empleado actualizado con éxito'); // Registro de cliente actualizado con éxito
      }, error => {
        console.error('Error al actualizar el empleado:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar el empleado', 'Error');
        this.loading = false;
      });
    } else {
      console.log('ID del empleado no válido:', this.id); // Registro del ID de cliente no válido
      this.toastr.error('ID del empleado no válido', 'Error');
    }
  }


  mostrarModal() {
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

   guardar() {
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


  deleteEmpleado(id: number) {
    // Mostrar confirmación antes de eliminar el empleado
    Swal.fire({
      title: 'Eliminar Empleado',
      text: '¿Estás seguro de que deseas eliminar este empleado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeleteEmpleado(id);
      }
    });
  }

  performDeleteEmpleado(id: number) {
    this.loading = true;
    this._empleadoService.deleteEmpleado(id).subscribe(() => {
      this.getListEmpleados();
      this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
    })
  }


  // constructor(private impresionService: ImpresionService) { }

  onImprimir() {
    const entidad = 'Empleados'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Empleados'; // Título del informe
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
