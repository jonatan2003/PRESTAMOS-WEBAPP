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


@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit  {
  fechaActual: Date;

  formPago: FormGroup;
  formElectrodomestico: FormGroup;
  formVehiculo: FormGroup;
  id: number;
  listPrestamos: Prestamo[] = [];
  listPagos: Pago[] = [];

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
      idcliente:  [{ value: '', disabled: true }, ],
      idarticulo:  [{ value: '', disabled: true }, ],
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


                this.formPago.valueChanges.subscribe(() => {
                  this.setMontoRestante(); // Llama a la función para actualizar el monto restante
                });
              }
              setMontoRestante() {
                const tipoPago = this.formPago.value.tipo_pago;
                const interes = this.formPago.value.interes_pago || 0;
                const capitalPago = this.formPago.value.capital_pago || 0;
              
                let montoRestante = this.selectedPrestamo.monto_pago; // Iniciar con el monto total del préstamo
              
                if (tipoPago === 'interes') {
                  montoRestante -= interes; // Restar el interés del monto restante
                } else if (tipoPago === 'prestamo') {
                  montoRestante -= capitalPago; // Restar el capital de pago del monto restante
                } else if (tipoPago === 'completo') {
                  montoRestante -= (interes + capitalPago); // Restar ambos interés y capital de pago del monto restante
                  this.formPago.get('estado').setValue('pagado'); // Establecer el estado como 'pagado'
                }
              
                this.formPago.get('monto_restante').setValue(montoRestante);
              
                // Verificar si el monto restante es igual a cero para establecer el estado como 'pagado'
                if (montoRestante === 0) {
                  this.estado = "pagado";
                  this.formPago.get('estado').setValue('pagado');
                }
              }
            


              getListPrestamos() {
                this.loading = true;
              
                // Ajusta el método para aceptar parámetros de paginación
                this._paginacionService.getListPrestamos(this.currentPage, this.pageSize).subscribe((response: any) => {
                  this.listPrestamos = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
                  this.loading = false;
              
                  // Utiliza totalItems del objeto de respuesta para calcular totalPages
                  this.totalPages = response.totalPages;
                });
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
            
              setSelectedPago(prestamo: Prestamo) {
                this.selectedPrestamo = prestamo;
               this.nombreClienteSeleccionado = prestamo.Cliente.nombre + " " +prestamo.Cliente.apellido ;
             this.nombresempleado = prestamo.Empleado.nombre + " " +prestamo.Empleado.apellidos ;
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
                    observacion: prestamo.observacion,
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
                    observacion: prestamo.observacion,
                    estado: "pendiente"
                  });

                }
                  // Resetear el estado de validación del formulario y establecer formularioModificado a false
                  this.formPago.markAsUntouched();
                  this.mostrarModalPago();
                  console.log('Estado del formulario:', this.formPago.valid);
               
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
                  idempleado : 2 ,
                  fecha_prestamo: this.formPago.value.monto_pago,
                  fecha_devolucion: this.formPago.value.monto_pago,
                  monto_prestamo : 44 ,
                  monto_pago: this.formPago.value.monto_pago,
                  observacion: "",
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
                    this.getListPrestamos();
              
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
 
                  idprestamo: this.formPago.value.idprestamo,
                  tipo_pago: this.formPago.value.tipo_pago,
                  fecha_pago: this.fechaActual,
                  interes_pago: this.formPago.value.interes_pago,
                  monto_restante: this.formPago.value.monto_restante,
                  capital_pago: this.formPago.value.capital_pago
                  
                  // ... Otros campos del formulario de articulo según la interfaz
                };
               const idprestamo = this.selectedPrestamo.id;
                const prestamo: Prestamo = {
                 
                  idcliente: this.selectedPrestamo.idcliente,
                  idempleado: this.selectedPrestamo.idempleado,
                  idarticulo:  this.selectedPrestamo.idarticulo,
                  fecha_prestamo:  this.selectedPrestamo.fecha_prestamo,
                  fecha_devolucion: this.selectedPrestamo.fecha_devolucion,
                  monto_prestamo: this.selectedPrestamo.monto_prestamo,
                  monto_pago: this.formPago.value.monto_restante,
                  observacion:  this.selectedPrestamo.observacion,
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

                  this.getListPrestamos();
                  this.guardarPago();
                   // Es agregar
                   
  this._pagoService.savePago(pago).pipe(
    switchMap((response: Pago) => {
      this.toastr.success(`El pago fue registrado con éxito`, 'Pago registrado');
      const idPago = response.id;

      // Obtener el pago completo usando su ID
      return this._pagoService.getPago(idPago);
    })
  ).subscribe(
    (pagoGuardado: Pago) => {
      // Agregar el pago guardado a la lista de pagos
      this.listPagos.push(pagoGuardado);
      this.loading = false;

      // Obtener el índice del último elemento agregado
      const lastIndex = this.listPagos.length - 1;

      // Llamar a la función para imprimir fila del último pago agregado
     // this.onImprimirFilaPagos(lastIndex);

      // Redirigir después de guardar
      this.router.navigate(['admin/pagos-list']);
    },
    error => {
      console.error('Error al obtener el pago guardado:', error);
      this.loading = false;
    }
  );
               
                  


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


            










  deletePrestamo(id: number) {
    // Mostrar confirmación antes de eliminar el prestamo
    Swal.fire({
      title: 'Eliminar Prestamo',
      text: '¿Estás seguro de que deseas eliminar este Prestamo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeletePrestamo(id);
      }
    });
  }

  performDeletePrestamo(id: number) {
    
    this.loading = true;
    this._prestamosService.deletePrestamo(id).subscribe(() => {
      this.getListPrestamos();
      this.toastr.warning('El Prestamo fue eliminado con exito', 'Prestamo eliminado');
    })



  }


  
onImprimir() {
  const entidad = 'Prestamos'; // Nombre de la entidad (para el nombre del archivo PDF)
  const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
  const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
  const titulo = 'Lista de Prestamos'; // Título del informe
  
  // Eliminar filas duplicadas del cuerpo
  const cuerpoUnico = this.eliminarFilasDuplicadas(cuerpo);

  // Llamar al servicio de impresión
  this.impresionService.imprimir(entidad, encabezado, cuerpoUnico, titulo, true);
}

// Método para eliminar filas duplicadas del cuerpo de la tabla
eliminarFilasDuplicadas(cuerpo: Array<any>): Array<any> {
  const cuerpoUnico: Array<any> = [];
  const filasVistas = new Set(); // Usamos un conjunto para mantener un registro de las filas vistas
  cuerpo.forEach((fila) => {
      // Convertimos la fila en una cadena para poder compararla con otras filas
      const filaString = JSON.stringify(fila);
      if (!filasVistas.has(filaString)) {
          // Si la fila no ha sido vista antes, la agregamos al cuerpo único y al conjunto de filas vistas
          cuerpoUnico.push(fila);
          filasVistas.add(filaString);
      }
  });
  return cuerpoUnico;
}

  getEncabezado(): string[] {
    const encabezado: string[] = [
      'CLIENTE',
      'EMPLEADO',
      'ARTICULO',
      'FECHA DE PRÉSTAMO',
      'FECHA DE DEVOLUCION',
      'MONTO PRESTAMO',
      'MONTO PAGO',
      'OBSERVACION',
      'ESTADO'
    ];
  
    return encabezado;
  }



  getCuerpo(): any[][] {
    const cuerpo: any[][] = [];
    const textosExcluidos = new Set(['Actualizar', 'Eliminar', 'Imprimir', 'Pagos']); // Textos a excluir
    const filasVistas = new Set(); // Usar un conjunto para mantener un registro de las filas ya vistas
    
    this.listPrestamos.forEach((prestamo) => {
      const fila: any[] = [
        prestamo.Cliente?.nombre + ' ' + prestamo.Cliente?.apellido,
        prestamo.Empleado?.nombre + ' ' + prestamo.Empleado?.apellidos,
        prestamo.Articulo ? (prestamo.Articulo.Vehiculo ? prestamo.Articulo.Vehiculo.descripcion : (prestamo.Articulo.Electrodomestico ? prestamo.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
        prestamo.fecha_prestamo,
        prestamo.fecha_devolucion,
        prestamo.monto_prestamo,
        prestamo.monto_pago,
        prestamo.observacion,
        prestamo.estado
      ];
  
      // Convertir la fila en una cadena para compararla
      const filaString = fila.join('|');
  
      // Solo agregar la fila al cuerpo si no se ha visto antes
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });
  
    return cuerpo;
  }

  
  onImprimirFilaPagos(index: number) {
    const pago = this.listPagos[index];
    this.impresionService.imprimirFilaPagos('Pagos', {
      cliente: pago.Prestamo.Cliente?.nombre +" " + pago.Prestamo.Cliente?.apellido || '',
      dni: pago.Prestamo.Cliente?.dni || '',
      empleado:pago.Prestamo.Empleado?.nombre +" " + pago.Prestamo.Empleado?.apellidos || '',
      articulo: pago.Prestamo?.Articulo ? (pago.Prestamo?.Articulo.Vehiculo ? pago.Prestamo?.Articulo.Vehiculo.descripcion :  (pago.Prestamo?.Articulo.Electrodomestico ? pago.Prestamo?.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
      tipo_pago: pago.tipo_pago || '',
      fecha_pago: this.formatDate(pago.fecha_pago) || '',
      interes_pago: pago.interes_pago || '',
      monto_restante: pago.monto_restante || '',
      capital_pago: pago.capital_pago || '',
      estado: pago.Prestamo?.estado || ''
    } );
  }

  
  
onImprimirFila(index: number) {
  const prestamo = this.listPrestamos[index];
  this.impresionService.imprimirFilaPrestamos('Prestamos', {
    cliente: prestamo.Cliente?.nombre +" " + prestamo.Cliente?.apellido || '',
    dni: prestamo.Cliente?.dni || '',
    empleado: prestamo.Empleado?.nombre +" " + prestamo.Empleado?.apellidos || '',
    articulo: prestamo.Articulo ? (prestamo.Articulo.Vehiculo ? prestamo.Articulo.Vehiculo.descripcion : (prestamo.Articulo.Electrodomestico ? prestamo.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
    fechaPrestamo: this.formatDate(prestamo.fecha_prestamo) || '',
    fechaDevolucion: this.formatDate(prestamo.fecha_devolucion) || '',
    montoPrestamo: prestamo.monto_prestamo || '',
    montoPago: prestamo.monto_pago || '',
    observaciones: prestamo.observacion || '',
    estado:prestamo.estado || ''
  } );
}


  formatDate(date: string | Date): string {
    // Utiliza la función formatDate de Angular para formatear la fecha
    // Consulta la documentación de Angular para opciones de formato: https://angular.io/api/common/formatDate
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
  


}
