import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent {
  form: FormGroup;
  id: number;

  listClientes: Cliente[] = []
  loading: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  selectedCliente: Cliente | null = null;

// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor(private _clientesService: ClienteService,
    private _paginacionService: PaginacionService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private aRouter: ActivatedRoute,
     private impresionService: ImpresionService) { 

      this.form = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        direccion: ['', Validators.required],
        dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
        telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
        rubro: ['', Validators.required],
        // ... Otros campos del formulario de clientes
      });

      this.id = Number(aRouter.snapshot.paramMap.get('id'));

    }

  ngOnInit(): void {
    this.getListClientes();
  }

 

  getListClientes() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._paginacionService.getListClientes(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listClientes = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
      this.totalPages = response.totalPages;
    });
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListClientes();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  setSelectedCliente(cliente: Cliente) {
    this.selectedCliente = cliente;
  
    // Validar los datos de entrada antes de asignarlos al formulario
    if (cliente.dni && cliente.dni.length === 8 && /^\d+$/.test(cliente.dni) &&
        cliente.telefono && cliente.telefono.length === 9 && /^\d+$/.test(cliente.telefono)) {
      this.id = cliente.id;
      // Establecer los valores del cliente seleccionado en el formulario
      this.form.patchValue({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        direccion: cliente.direccion,
        dni: cliente.dni,
        telefono: cliente.telefono,
        rubro: cliente.rubro
      });
  
      // MARCAR PENDIENDTE el estado de validación del formulario
      this.form.markAsUntouched();
      this.mostrarModal();
      console.log('Estado del formulario:', this.form.valid);
    } else {
      console.log('Datos de cliente no válidos.');
    }
  }
  

  deleteCliente(id: number) {
    // Mostrar confirmación antes de eliminar el cliente
    Swal.fire({
      title: 'Eliminar Cliente',
      text: '¿Estás seguro de que deseas eliminar este cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeleteCliente(id);
      }
    });
  }

  performDeleteCliente(id: number) {
    this.loading = true;
    this._clientesService.deleteCliente(id).subscribe(() => {
      this.getListClientes();
      this.toastr.warning('El Cliente fue eliminado con exito', 'Cliente eliminado');
    })
  }
  updateCliente() {
    const cliente: Cliente = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      direccion: this.form.value.direccion,
      dni: this.form.value.dni,
      ruc:  this.form.value.dni,
      telefono: this.form.value.telefono,
      rubro: this.form.value.rubro,
      // ... Otros campos del formulario de clientes según la interfaz
    };
  
    console.log('Cliente a actualizar:', cliente); // Agregar registro de cliente a actualizar
  
    if (this.id !== 0) {
      console.log('ID del cliente a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar
  
      this.loading = true;
  
      cliente.id = this.id;
      this._clientesService.updateCliente(this.id, cliente).subscribe(() => {
        this.toastr.info(`El cliente ${cliente.nombre} fue actualizado con éxito`, 'Cliente actualizado' ,
        {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
        
        this.loading = false;
        this.getListClientes();
  
        console.log('Cliente actualizado con éxito'); // Registro de cliente actualizado con éxito
      }, error => {
        console.error('Error al actualizar el cliente:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar el cliente', 'Error');
        this.loading = false;
      });
    } else {
      console.log('ID del cliente no válido:', this.id); // Registro del ID de cliente no válido
      this.toastr.error('ID del cliente no válido', 'Error');
    }
  }
  mostrarModal() {
    // Mostrar el modal
    const modal = document.getElementById('ModalCliente');
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
    const modal = document.getElementById('ModalCliente');
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

  
  // constructor(private impresionService: ImpresionService) { }

  onImprimir() {
    const entidad = 'Clientes'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Clientes'; // Título del informe
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
