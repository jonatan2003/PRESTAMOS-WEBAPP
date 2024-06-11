import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { PaginacionService } from 'src/app/services/paginacion.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent {
  form: FormGroup;
  id: number;
  formRuc: FormGroup;

  clientes: Cliente[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listClientes: Cliente[] = []
  listClientesDNI: Cliente[] = []
  listClientesRUC: Cliente[] = []
  categoriaSeleccionada: number = 0; 

  loading: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  selectedCliente: Cliente | null = null;
 // Define propiedades para la paginación
 currentPage: number = 1;
 pageSize: number = 10; // Tamaño de la página
 totalItems: number;
 totalPages: number = 0;   // Inicializa totalPages en 0

 
  constructor(  private router: Router,private searchService: SearchService,
     private _clientesService: ClienteService,
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

      this.formRuc = this.fb.group({
        direccion: ['', [Validators.required, Validators.maxLength(80)]],
        ruc: ['', [Validators.required, Validators.maxLength(11), Validators.pattern("^[0-9]*$")]],
        razon_social: ['', [Validators.required, Validators.maxLength(50)]],
        telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
        rubro: ['', [Validators.required, Validators.maxLength(25)]],
    });

      this.id = Number(aRouter.snapshot.paramMap.get('id'));

    }

  

 // Método para realizar la búsqueda de clientes
buscarClientes() {
  this.loading = true; // Establecer loading en true para mostrar la carga

  // Verificar si se ha ingresado un término de búsqueda
  if (!this.terminoBusqueda) {
    this.toastr.warning('INGRESAR DATOS DEL CLIENTE PARA BUSCAR', 'Advertencia', {
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    });
    this.loading = false; // Establecer loading en false al finalizar la carga
    return; // Salir de la función si no se ha ingresado ningún término de búsqueda
  }

  // Continuar con la búsqueda si se ha ingresado un término de búsqueda
  this.searchService.searchClientes(this.currentPage, this.pageSize, this.terminoBusqueda).subscribe(
    (response: any) => {
      this.clientes = response.data; // Asignar los datos de clientes a la propiedad clientes
      this.currentPage = response.page; // Actualizar currentPage con el número de página actual
      this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
      this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
      this.loading = false; // Establecer loading en false al finalizar la carga
      
      // Filtrar los clientes por tipo
      this.listClientesDNI = this.clientes.filter(cliente => cliente.ruc === 'no');
      this.listClientesRUC = this.clientes.filter(cliente => cliente.dni === 'no');

      // Establecer categoriaSeleccionada basado en los resultados de las búsquedas
      if (this.listClientesDNI.length > 0) {
        this.categoriaSeleccionada = 1; // Si hay clientes con DNI
      } else if (this.listClientesRUC.length > 0) {
        this.categoriaSeleccionada = 2; // Si hay clientes con RUC
      } else {
        this.categoriaSeleccionada = 0; // Si no hay clientes encontrados
      }

      // Verificar si no se encontraron clientes después de la búsqueda
      if (this.clientes.length === 0) {
        this.toastr.warning('No se encontró el cliente especificado', 'Advertencia', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    },
    error => {
      console.error('Error al buscar cliente:', error);
      this.loading = false; // Manejar el error y establecer loading en false

      this.toastr.error(error.msg, 'Cliente no encontrado', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  );
}

  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.buscarClientes();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.listClientesDNI = []; // Limpiar la lista de clientes
    this.listClientesRUC = []; // Limpiar la lista de clientes
  }




  
  setSelectedCliente(cliente: Cliente) {
    this.selectedCliente = cliente;
    this.id = cliente.id;

    if (this.categoriaSeleccionada === 1) {
     

        this.form.patchValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            direccion: cliente.direccion,
            dni: cliente.dni,
            telefono: cliente.telefono,
            rubro: cliente.rubro
        });

        this.form.markAsUntouched();
        this.mostrarModal();
        console.log('Estado del formulario:', this.form.valid);
    } else if (this.categoriaSeleccionada === 2) {
      

        this.formRuc.patchValue({
           
            direccion: cliente.direccion,
            ruc: cliente.ruc,
            razon_social: cliente.razon_social,
            telefono: cliente.telefono,
            rubro: cliente.rubro
        });

        this.formRuc.markAsUntouched();
        this.mostrarModal();
        console.log('Estado del formulario:', this.formRuc.valid);
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
      this.clientes;
      this.toastr.warning('El Cliente fue eliminado con exito', 'Cliente eliminado');
      this.buscarClientes();
    })

    
  }
  updateCliente() {
    const cliente: Cliente = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      direccion: this.form.value.direccion,
      dni: this.form.value.dni,
      ruc: "no",
      razon_social: "no",
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
        this.buscarClientes();

  
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


  updateClienteRuc() {
    const cliente: Cliente = {
      nombre:"no",
      apellido: "no",
      direccion: this.formRuc.value.direccion,
      dni: "no",
      ruc: this.formRuc.value.ruc,
      razon_social: this.formRuc.value.razon_social,
      telefono: this.formRuc.value.telefono,
      rubro: this.formRuc.value.rubro,
      // ... Otros campos del formulario de clientes según la interfaz
    };
  
    console.log('Cliente a actualizar:', cliente); // Agregar registro de cliente a actualizar
  
    if (this.id !== 0) {
      console.log('ID del cliente a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar
  
      this.loading = true;
  
      cliente.id = this.id;
      this._clientesService.updateCliente(this.id, cliente).subscribe(() => {
        this.toastr.info(`El cliente ${cliente.razon_social} fue actualizado con éxito`, 'Cliente actualizado' ,
        {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
        
        this.loading = false;
        this.buscarClientes();
  
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
