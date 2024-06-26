import { Component,Injectable,OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ArticulosService } from 'src/app/services/articulo.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
import { formatDate } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { CronogramaPagosService } from 'src/app/services/cronograma_pagos.service';
import { CronogramaPago } from 'src/app/interfaces/cronograma_pagos.interface';


@Component({
  selector: 'app-reservation-list',
  templateUrl: './Prestamos-list.component.html',
  styleUrls: ['./Prestamos-list.component.css']
})
export class PrestamosListComponent implements OnInit  {
  fechaActual: Date;

  formPago: FormGroup;
  formElectrodomestico: FormGroup;
  formVehiculo: FormGroup;
  id: number;
  listPrestamos: Prestamo[] = [];
  listCronogramaPago: CronogramaPago[] = [];
  listPagos: Pago[] = [];
  listTickets: Ticket[] = [];
  loading: boolean = false;
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
montoRestante: number ;
  constructor(private authService: AuthService,
    private _paginacionService: PaginacionService,
    private _categoriasService: CategoriaService,
   private _electrodomesticoService: ElectrodomesticoService,
   private _vehiculoService: VehiculoService,
   private fb: FormBuilder,
   private searchService: SearchService,
   private _clientesService: ClienteService,
   private _articulosService: ArticulosService,
   private _empleadosService: EmpleadoService,
   private _prestamosService: PrestamoService,
   private _CronogramaPagos: CronogramaPagosService,
   private _pagoService: PagosService,
   private router: Router,
   private toastr: ToastrService,
   private aRouter: ActivatedRoute,
   private impresionService: ImpresionService ) { 

    this.formPago = this.fb.group({
      
      idprestamo :  ['', Validators.required],
      tipo_pago:  ['', Validators.required],
      fecha_pago:  ['', Validators.required],
      interes_pago:   ['', Validators.required],
      monto_restante:  ['', Validators.required],
      capital_pago:  ['', Validators.required],
      fecha_prestamo: [{ value: '', disabled: true }, ],
      fecha_devolucion: [{ value: '', disabled: true }, ],
      monto_prestamo:  [{ value: '', disabled: true }, ],
      tasa_interes:  [{ value: '', disabled: true }, ],
      monto_pago:  [{ value: '', disabled: true }, ],
      descripcion: [{ value: '', disabled: true }, ],
      observacion: [{ value: '', disabled: true }, ],
      // ... Otros campos del formulario de articulos
    });


  
    this.id = Number(aRouter.snapshot.paramMap.get('id'));


   }

               ngOnInit(): void {
                this.fechaActual = new Date();

                this.getListPrestamos();

                
              }
           


              getListPrestamos() {
                this.loading = true;
              
                // Ajusta el método para aceptar parámetros de paginación
                this._paginacionService.getListPrestamos(this.currentPage, this.pageSize).subscribe(
                  (response: any) => {
                    // Filtrar los tickets para mostrar solo aquellos que tienen un préstamo y no tienen un pago
                    this.listTickets = response.data;
              
                    this.loading = false;
              
                    // Utiliza totalItems del objeto de respuesta para calcular totalPages
                    this.totalPages = response.totalPages;
                  },
                  error => {
                    console.error('Error al cargar los préstamos:', error);
                    this.toastr.error('Hubo un error al cargar los préstamos', 'Error');
                    this.loading = false;
                  }
                );
              }
              
              // Método para cambiar de página
              pageChanged(page: number) {
                this.currentPage = page;
                this.getListPrestamos();
              }
              
              // Método para generar las páginas disponibles
              getPages(): number[] {
                // Retorna un array de números enteros del 1 al totalPages
                return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

          this.getListPrestamos();
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
