import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ArticulosService } from 'src/app/services/articulo.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { Prestamo } from 'src/app/interfaces/prestamo.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ElectrodomesticoService } from 'src/app/services/electrodomestico.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { Date } from 'core-js';
import { Pago } from 'src/app/interfaces/pago.interface';
import { PagosService } from 'src/app/services/pago.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { formatDate } from '@angular/common';
import { CronogramaPago } from 'src/app/interfaces/cronograma_pagos.interface';
import { CronogramaPagosService } from 'src/app/services/cronograma_pagos.service';


@Component({
  selector: 'app-prestamos-search',
  templateUrl: './prestamos-search.component.html',
  styleUrls: ['./prestamos-search.component.css']
})
export class PrestamosSearchComponent {


  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listTickets: Ticket[] = []
  loading: boolean = false;
  listCronogramaPago: CronogramaPago[] = [];


  fechaActual: Date;

  formPago: FormGroup;
  formElectrodomestico: FormGroup;
  formVehiculo: FormGroup;
  id: number;
  encabezado: string[] = [];
  cuerpo: string[][] = [];
  selectedPrestamo: Prestamo | null = null;
// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  monto_pago: number ;
  monto_prestamo: number;
nombreClienteSeleccionado: string ;
descripcionArticuloSeleccionado: string ;
nombresempleado: string;
tipo_pagoSeleccionado: string;
interes: number;
pagoPrestamo: number;
estado : string ;



  constructor( private searchService: SearchService, 
    private _paginacionService: PaginacionService,
    private _categoriasService: CategoriaService,
   private _electrodomesticoService: ElectrodomesticoService,
   private _CronogramaPagos: CronogramaPagosService,
   private _vehiculoService: VehiculoService,
   private fb: FormBuilder,
   private _clientesService: ClienteService,
   private _articulosService: ArticulosService,
   private _empleadosService: EmpleadoService,
   private _prestamosService: PrestamoService,
   private _pagoService: PagosService,
   private router: Router,
   private toastr: ToastrService,
   private aRouter: ActivatedRoute,
   private impresionService: ImpresionService) {


    this.formPago = this.fb.group({
      
      idprestamo :  ['', Validators.required],
      tipo_pago:  ['', Validators.required],
      fecha_pago:  ['', Validators.required],
      interes_pago:  [{ value: '', disabled: true }, ],
      monto_restante:  ['', Validators.required],
      capital_pago: [{ value: '', disabled: true }, ],
      idcliente:  [{ value: '', disabled: true }, ],
      idarticulo:  [{ value: '', disabled: true }, ],
      fecha_prestamo: [{ value: '', disabled: true }, ],
      fecha_devolucion: [{ value: '', disabled: true }, ],
      monto_prestamo:  [{ value: '', disabled: true }, ],
      tasa_interes:  [{ value: '', disabled: true }, ],
      monto_pago:  [{ value: '', disabled: true }, ],
      descripcion: [{ value: '', disabled: true }, ],
      // ... Otros campos del formulario de articulos
    });






   }

  

// Método para realizar la búsqueda de prestamos
buscarPrestamos() {

  
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.toastr.warning('Ingrese un término de búsqueda', 'Advertencia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
      return;
    }
  
  this.loading = true; // Establecer loading en true para mostrar la carga

this.searchService.searchPrestamos( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
  (response: any) => {
    this.listTickets = response.data; // Asignar los datos de empleados a la propiedad empleados
    this.currentPage = response.page; // Actualizar currentPage con el número de página actual
    this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
    this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
    this.loading = false; // Establecer loading en false al finalizar la carga

    if (this.listTickets.length === 0) {
      this.toastr.info('No se encontraron datos', 'Información', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
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
  this.buscarPrestamos();
}

// Método para generar las páginas disponibles
getPages(): number[] {
  // Retorna un array de números enteros del 1 al totalPages
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}


  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.listTickets = []; // Limpiar la lista de prestamos
  }


  setSelectedPago(prestamo: Prestamo) {
    this.selectedPrestamo = prestamo;
   this.nombreClienteSeleccionado = prestamo.Cliente.nombre + " " +prestamo.Cliente.apellido ;
//  this.nombresempleado = prestamo.Empleado.nombre + " " +prestamo.Empleado.apellidos ;
 this.estado = "pendiente";

   
      this.id = prestamo.id;
      // Establecer los valores del cliente seleccionado en el formulario
      if(prestamo.Articulo.Categoria.id === 1){

        this.descripcionArticuloSeleccionado = prestamo.Articulo.Vehiculo.descripcion + " " 
      +prestamo.Articulo.Vehiculo.marca + " " 
       +prestamo.Articulo.Vehiculo.modelo + " " +prestamo.Articulo.Vehiculo.placa;
       this.monto_pago = prestamo.monto_pago;
       this.monto_prestamo = prestamo.monto_prestamo;



      this.formPago.patchValue({
        fecha_pago : this.fechaActual,
        idprestamo : prestamo.id,
        fecha_prestamo: prestamo.fecha_prestamo,
        fecha_devolucion: prestamo.fecha_devolucion,
        monto_prestamo: prestamo.monto_prestamo,
        estado: "pendiente"


      });

    }else if (prestamo.Articulo.Categoria.id === 2 ){

      this.descripcionArticuloSeleccionado = prestamo.Articulo.Electrodomestico.descripcion + " " 
      +prestamo.Articulo.Electrodomestico.marca + " " 
       +prestamo.Articulo.Electrodomestico.modelo + " " +prestamo.Articulo.Electrodomestico.numero_serie;
     this.monto_pago = prestamo.monto_pago;
     this.monto_prestamo = prestamo.monto_prestamo;


      this.formPago.patchValue({
        fecha_pago : this.fechaActual,
        idprestamo : prestamo.id,
        fecha_prestamo: prestamo.fecha_prestamo,
        fecha_devolucion: prestamo.fecha_devolucion,
        monto_prestamo: prestamo.monto_prestamo,
        estado: "pendiente"
      });

    }
      // Resetear el estado de validación del formulario y establecer formularioModificado a false
      this.formPago.markAsUntouched();
      this.mostrarModalPago();
      console.log('Estado del formulario:', this.formPago.valid);
   
  }

  setSelectTipodePago(event: any) {
    const selectetipo_pago = event.target.value;
    this.tipo_pagoSeleccionado = selectetipo_pago;
    const montoOriginal = this.monto_pago / 1.20;
    
    if (this.tipo_pagoSeleccionado === "interes") {
      this.interes = 0.20 * montoOriginal;
      this.pagoPrestamo = this.monto_pago - this.interes;
  
      // Actualizar el formulario con los valores calculados
      this.formPago.patchValue({
        capital_pago: 0, // Aquí puedes asignar el valor deseado para capital_pago
        interes_pago: this.interes,
        monto_restante: this.monto_pago - this.interes
      });
    } else if (this.tipo_pagoSeleccionado === "prestamo") {
      this.interes = 0;
      this.pagoPrestamo = montoOriginal;
  
      // Actualizar el formulario con los valores calculados
      this.formPago.patchValue({
        capital_pago: this.pagoPrestamo, // Asigna el valor de capital_pago
        interes_pago: 0,
        monto_restante: this.monto_pago - this.pagoPrestamo
      });
    } else if (this.tipo_pagoSeleccionado === "completo") {
      this.interes = 0.20 * montoOriginal;
      this.pagoPrestamo = this.monto_pago - this.interes;
     this.estado = "pagado";
      // Actualizar el formulario con los valores calculados
      this.formPago.patchValue({
        capital_pago: this.pagoPrestamo,
        interes_pago: this.interes,
        monto_restante: 0, // Si es completo, el monto restante es 0
        estado: "pagado"
      });
    }
  
    // Verifica el valor de capital_pago dentro de este contexto
    console.log("Capital Pago dentro de setSelectTipodePago:", this.formPago.value.interes_pago);
  }

  setSelectedPrestamo(prestamo: Prestamo) {
    this.selectedPrestamo = prestamo;
  
   
      this.id = prestamo.id;
      // Establecer los valores del cliente seleccionado en el formulario
      this.formPago.patchValue({
        
        monto_pago: prestamo.monto_pago,
       
      });

      // Resetear el estado de validación del formulario y establecer formularioModificado a false
      this.formPago.markAsUntouched();
      this.mostrarModal();
      console.log('Estado del formulario:', this.formPago.valid);
   
  }
  
  mostrarModalPago() {
    // Mostrar el modal
    const modal = document.getElementById('ModalPago');
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



  mostrarModal() {
    // Mostrar el modal
    const modal = document.getElementById('ModalPrestamo');
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

  updatePrestamo() {
    const prestamo: Prestamo = {
      idarticulo : 1 ,
      idcliente : 2 ,
      fecha_prestamo: this.formPago.value.monto_pago,
      fecha_devolucion: this.formPago.value.monto_pago,
      monto_prestamo : 44 ,
      monto_pago: this.formPago.value.monto_pago,
      estado: this.formPago.value.monto_pago,
     
    };
  
    console.log('Prestamo a actualizar:', prestamo); // Agregar registro de cliente a actualizar
  
    if (this.id !== 0) {
      console.log('ID del Prestamo a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar
  
      this.loading = true;
  
      prestamo.id = this.id;
      this._prestamosService.updatePrestamo(this.id, prestamo).subscribe(() => {
        this.toastr.info(`El prestamo ${prestamo.Articulo.Electrodomestico.descripcion} fue actualizado con éxito`, 'Prestamo actualizado' ,
        {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
        
        this.loading = false;
        this.buscarPrestamos();
  
        console.log('Prestamo actualizado con éxito'); // Registro de cliente actualizado con éxito
      }, error => {
        console.error('Error al actualizar el Prestamo:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar la Prestamo', 'Error');
        this.loading = false;
      });
    } else {
      console.log('ID del Prestamo no válido:', this.id); // Registro del ID de cliente no válido
      this.toastr.error('ID del Prestamo no válido', 'Error');
    }
  }

  addPago(){

    const pago: Pago = {

      id_tipopago: this.formPago.value.tipo_pago,
      fecha_pago: this.fechaActual,
      interes_pago: this.interes,
      monto_restante: this.formPago.value.monto_restante,
      capital_pago: this.pagoPrestamo,
      
      // ... Otros campos del formulario de articulo según la interfaz
    };
   const idprestamo = this.selectedPrestamo.id;
    const prestamo: Prestamo = {
     
      idcliente: this.selectedPrestamo.idcliente,
      // idempleado: this.selectedPrestamo.idempleado,
      idarticulo:  this.selectedPrestamo.idarticulo,
      fecha_prestamo:  this.selectedPrestamo.fecha_prestamo,
      fecha_devolucion: this.selectedPrestamo.fecha_devolucion,
      monto_prestamo: this.selectedPrestamo.monto_prestamo,
      monto_pago: this.formPago.value.monto_restante,
      estado: this.estado
    };

    this.loading = true;
  
     

      this._prestamosService.updatePrestamo(this.selectedPrestamo.id, prestamo).subscribe(() => {
      
        this.loading = false;
       
  
        console.log('Monto pago actualizado con éxito'); // Registro de cliente actualizado con éxito
      }, error => {
        console.error('Error al actualizar el Prestamo:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar el Prestamo', 'Error');
        this.loading = false;
      });

      this.buscarPrestamos();
      this.guardarPago();
       // Es agregar
       this._pagoService.savePago(pago).subscribe(() => {
        this.toastr.success(`El pago fue registrado con éxito`, 'pago registrado');
        this.loading = false;
       // window.location.href = '/reservation-list';
         this.router.navigate(['admin/pagos-list']);
  
      });
   
      


  }
  
  


  guardar() {
    // Aquí iría tu lógica para guardar el formulario
    
    // Luego, cierra el modal
    const modal = document.getElementById('ModalPrestamo');
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

  guardarPago() {
    // Aquí iría tu lógica para guardar el formulario

    // Luego, cierra el modal
    const modal = document.getElementById('ModalPago');
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














  deletePrestamo(ticket : Ticket) {
    // Mostrar confirmación antes de eliminar el prestamo
    Swal.fire({
      title: 'ANULAR Prestamo',
      text: '¿Estás seguro de que deseas ANULAR este Prestamo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performUpdatePrestamo(ticket);
      }
    });
  }

  performUpdatePrestamo(ticket : Ticket) {
    
    
    
      const prestamo: Partial<Prestamo> = {
        estado: "anulado"
      };
    
      console.log('Prestamo a actualizar:', prestamo); // Log del objeto a actualizar
      console.log('ID del Prestamo a actualizar:', ticket.idprestamo); // Log del ID del préstamo a actualizar
    
      this.loading = true;
    
      
      this._prestamosService.updatePrestamoEstado(ticket.idprestamo, prestamo).subscribe(
        () => {
          this.loading = false;
          console.log('Préstamo actualizado con éxito'); // Log de éxito
          this.toastr.info('Préstamo ANULADO con éxito', 'ANULADO', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          this.buscarPrestamos();
        },
        error => {
          console.error('Error al actualizar el Préstamo:', error); // Manejo de errores
          this.toastr.error('Hubo un error al actualizar el Préstamo', 'Error', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          this.loading = false;
        }
      );
    



  }


shouldDisableButton(Ticket: Ticket): boolean {
  const estado = Ticket.Prestamo?.estado?.toLowerCase().trim();
 

  return estado === 'pagado' || 
         estado === 'vencido' ||
         estado === 'anulado' 
       ;
}



getCronogramaPagos(idPrestamo: number, callback: (cronograma: CronogramaPago[]) => void) {
  this.loading = true;
  
  this._CronogramaPagos.getCronogramaPagosByIdPrestamo(idPrestamo).subscribe((response: CronogramaPago[]) => {
    const cronograma = response.slice(0, 2); // Obtener solo los dos primeros registros
    this.loading = false;
    console.log(cronograma);
    callback(cronograma); // Llamar al callback con los datos del cronograma
  });
}



onImprimir() {
  const entidad = 'Prestamos';
  const encabezado = this.getEncabezado();
  const cuerpo = this.getCuerpo();
  const titulo = 'Lista de Prestamos';
  const cuerpoUnico = this.eliminarFilasDuplicadas(cuerpo);
  this.impresionService.imprimir(entidad, encabezado, cuerpoUnico, titulo, true);
}

// Método para eliminar filas duplicadas del cuerpo de la tabla
eliminarFilasDuplicadas(cuerpo: Array<any>): Array<any> {
const cuerpoUnico: Array<any> = [];
const filasVistas = new Set();
cuerpo.forEach((fila) => {
  const filaString = JSON.stringify(fila);
  if (!filasVistas.has(filaString)) {
    cuerpoUnico.push(fila);
    filasVistas.add(filaString);
  }
});
return cuerpoUnico;
}

getEncabezado(): string[] {
return [
  'CLIENTE',
  'EMPLEADO',
  'ARTICULO',
  'FECHA PRESTMO',
  'FECHA DEVOLUCION ',
  'MONTO PRESTAMO',
  'MONTO PAGO',
  'OBSERVACION',
  'ESTADO'
];
}

getCuerpo(): any[][] {
const cuerpo: any[][] = [];
const filasVistas = new Set();
this.listTickets.forEach((ticket) => {
  const fila: any[] = [
  
    ticket.Prestamo?.Cliente?.nombre,
    ticket.Empleado?.nombre + ' ' + ticket.Empleado?.apellidos,
    ticket.Prestamo?.Articulo ?
      (ticket.Prestamo?.Articulo.Vehiculo ?
        ticket.Prestamo?.Articulo.Vehiculo.descripcion :
        (ticket.Prestamo?.Articulo.Electrodomestico ?
          ticket.Prestamo?.Articulo.Electrodomestico.descripcion :
          'No hay descripción disponible')) :
      'No hay descripción disponible',
      ticket.Prestamo?.fecha_prestamo,
      ticket.Prestamo?.fecha_devolucion,
      ticket.Prestamo?.monto_prestamo,
      ticket.Prestamo?.monto_pago,
      ticket.Prestamo?.Articulo?.observaciones,
      ticket.Prestamo?.estado
  ];
  const filaString = fila.join('|');
  if (!filasVistas.has(filaString)) {
    cuerpo.push(fila);
    filasVistas.add(filaString);
  }
});
return cuerpo;
}

onImprimirFila(index: number) {
  const ticket = this.listTickets[index];
  const idPrestamo = ticket.Prestamo?.id;

  if (idPrestamo) {
    this.getCronogramaPagos(idPrestamo, (cronograma) => {
      const detallesCronograma = cronograma.map(( item) => ({
        fechaPago: this.formatDate(item.fecha_pago),
        montoPagado:item.monto_pagado,
      }));

      this.impresionService.imprimirFilaPrestamos('Ticket', {
        num_serie: ticket.num_serie,
        num_ticket: ticket.num_ticket,
        cliente:ticket.Prestamo?.Cliente?.nombre+" "+ticket.Prestamo?.Cliente?.apellido,
        dni: ticket.Prestamo?.Cliente?.dni || '',
        empleado: ticket.Empleado?.nombre + " " + ticket.Empleado?.apellidos || '',

        articulo: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.descripcion : 
          (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.descripcion :
            'No hay descripción disponible')) : 'No hay descripción disponible',

        marca: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.marca : 
          (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.marca :
            'No hay marca disponible')) : 'No hay marca disponible',

        modelo: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.modelo : 
          (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.modelo :
            'No hay modelo disponible')) : 'No hay modelo disponible',

        fechaPrestamo: this.formatDate(ticket.Prestamo?.fecha_prestamo) || '',
        fechaDevolucion: this.formatDate(ticket.Prestamo?.fecha_devolucion) || '',

        montoPrestamo: ticket.Prestamo?.monto_prestamo || '',
        montoPago: ticket.Prestamo?.monto_pago || '',
        observaciones: ticket.Prestamo?.Articulo?.observaciones || '',
        estado: ticket.Prestamo?.estado || '',

        cronogramaPagos: detallesCronograma
      });
    });
  } else {
    console.error('ID del préstamo no encontrado');
  }
}


formatDate(date: string | Date): string {
  // Utiliza la función formatDate de Angular para formatear la fecha
  // Consulta la documentación de Angular para opciones de formato: https://angular.io/api/common/formatDate
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}




}
