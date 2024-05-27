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
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { CronogramaPago } from 'src/app/interfaces/cronograma_pagos.interface';
import { TicketService } from 'src/app/services/ticket.service';
import { TipoPago } from 'src/app/interfaces/tipo_pago.interface';
import { TipopagoService } from 'src/app/services/tipopago.service';
import { CronogramaPagosService } from 'src/app/services/cronograma_pagos.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pagos-new',
  templateUrl: './pagos-new.component.html',
  styleUrls: ['./pagos-new.component.css']
})
export class PagosNewComponent {
  fechaActual: Date;
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  formPago: FormGroup;
  formElectrodomestico: FormGroup;
  formVehiculo: FormGroup;
  id: number;
  
  listPrestamos: Prestamo[] = [];
  listPagos: Pago[] = [];
  listTickets: Ticket[] = [];
  listTicketsPrestamo: Ticket[] = [];
  listCronogramaPagos : CronogramaPago[] = []
  ListTipoPagos: TipoPago[] = []
  loading: boolean = false;
  encabezado: string[] = [];
  cuerpo: string[][] = [];
  selectedPrestamo: Prestamo | null = null;
  selectedCronogramapagos: CronogramaPago | null = null;
// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0
sumaMontoPagado: number ;
monto_pagado: number ;
idcronogramapagos: number ;
capital_pago : number ;
estadopago : string ;
empleadoid : number;
  monto_pago: number ;
  monto_prestamo: number;
nombreClienteSeleccionado: string ;
descripcionArticuloSeleccionado: string ;
nombresempleado: string;
tipo_pagoSeleccionado: string;
interes: number;
interesfinal : number;
pagoPrestamo: number;
estado : string ;
montoRestante: number ;
montoRestanteFinal: number ;
monto_inicial: number ;
fecha_pago : Date ;
  constructor(private authService: AuthService,
    private _paginacionService: PaginacionService,
    private _categoriasService: CategoriaService,
   private _electrodomesticoService: ElectrodomesticoService,
   private _vehiculoService: VehiculoService,
   private _ticketService: TicketService,
   private _cronogramaService: CronogramaPagosService,
   private fb: FormBuilder,
   private searchService: SearchService,
   private _clientesService: ClienteService,
   private _articulosService: ArticulosService,
   private _empleadosService: EmpleadoService,
   private _prestamosService: PrestamoService,
   private _TipoPagoService : TipopagoService,
   private _pagoService: PagosService,
   private router: Router,
   private toastr: ToastrService,
   private aRouter: ActivatedRoute,
   private impresionService: ImpresionService ) { 

    this.formPago = this.fb.group({
      
      id_tipopago:  ['', Validators.required],
      fecha_pago:  ['', Validators.required],
      pago: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
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


  
    this.id = Number(aRouter.snapshot.paramMap.get('id'));


   }

               ngOnInit(): void {
                this.fechaActual = new Date();
                this.getTipoPagos();
                //this.getListPrestamos();
                


                this.formPago.valueChanges.subscribe(() => {
                  this.setMontoRestante(); // Llama a la función para actualizar el monto restante
                });
              }

              shouldDisableButton(cronogramapagos: any): boolean {
                const estado = cronogramapagos.Prestamo?.estado?.toLowerCase().trim();
                const fechaPago = new Date(cronogramapagos.fecha_pago);
                const fechaActualDate = new Date(this.fechaActual);
                
                return estado === 'pagado' || 
                       estado === 'vendido' || 
                       cronogramapagos.monto_pagado > 0 || 
                       fechaPago.getTime() < fechaActualDate.getTime();
              }

              setMontoRestanInicial(){
                this.fecha_pago  = this.selectedCronogramapagos.fecha_pago;
                this.idcronogramapagos = this.selectedCronogramapagos.id;
                this.selectedPrestamo = this.selectedCronogramapagos.Prestamo;
                this.monto_pagado = this.selectedCronogramapagos.monto_pagado;
                console.log (this.selectedCronogramapagos.Prestamo.id)
                this.getListTicketsPrestamos(this.selectedCronogramapagos.Prestamo.id);
                console.log(this.idcronogramapagos);

               this.nombreClienteSeleccionado = this.selectedCronogramapagos.Prestamo.Cliente.nombre + " " +this.selectedCronogramapagos.Prestamo.Cliente.apellido ;
              
           // this.nombresempleado = this.listTicketsPrestamo.Empleado.nombre+ " " +listTicketsPrestamo.Empleado.apellidos ;
           
             this.estado = "pendiente";
             
           
              }

              setMontoRestante() {
                let tipoPago = this.formPago.get('id_tipopago').value;
             
               let monto_restante = this.montoRestanteFinal
                
                  switch (tipoPago) {
                    
                    case "1":
                  monto_restante -= this.interes; // Restar el interés del monto restante
                  this.formPago.patchValue({ pago:  this.interes }, { emitEvent: false });
                  this.capital_pago = 0;
                  this.interesfinal = this.formPago.get('pago').value;
                  this.pagoPrestamo= this.formPago.get('pago').value;
                  console.log(this.interes,{ emitEvent: false });
                  break;
                  case "2":
                  if (this.montoRestanteFinal < this.monto_inicial){

                    this.formPago.patchValue({ pago: this.montoRestanteFinal }, { emitEvent: false });


                  }
                  else if (this.montoRestanteFinal > this.monto_inicial){

                    this.formPago.patchValue({ pago: this.monto_inicial }, { emitEvent: false });


                  }
                   
                

                  this.capital_pago = this.formPago.value.pago;
                  this.interesfinal = 0;
                  this.pagoPrestamo= this.formPago.value.pago;
                  break;
                  case "3":
                
                  this.formPago.patchValue({ pago: this.montoRestanteFinal }, { emitEvent: false });
                 
                  this.capital_pago = this.montoRestanteFinal;
                  this.interesfinal = 0;
                  this.pagoPrestamo= this.formPago.value.pago;
                  break;
                  case "4":
                  const pago = this.formPago.get('pago').value;
                   if (pago > this.interes){
                      this.capital_pago = pago - this.interes;
                      this.interesfinal = pago - this.capital_pago ;
                      this.pagoPrestamo= this.formPago.value.pago;
                   }
                   break;
                  }
                
              }

              isOptionDisabled(tipopago: any): boolean {

                if (tipopago.nombre_tipo === 'interes') {
                  return this.sumaMontoPagado > this.interes;
                }
                
                if (tipopago.nombre_tipo === 'prestamo') {
                  return this.sumaMontoPagado === this.monto_inicial;
                }


                
                

                return false;
              }
            
              buscarPagos(): void {
                // Verificar si this.terminoBusqueda está vacío
                if (!this.terminoBusqueda.trim()) {
                  this.toastr.warning('Por favor, ingrese un DNI.', '', { positionClass: 'toast-top-right' }); // Mostrar toast de advertencia
                  return; // Salir de la función
                }
              
                this.loading = true; // Establecer loading en true para mostrar la carga
              
                this.searchService.searchCronogramaPagos(this.currentPage, this.pageSize, this.terminoBusqueda).subscribe(
                  (response: any) => {
                    this.listCronogramaPagos = response.data; // Asignar los datos de cronograma de pagos a la propiedad listCronogramaPagos
                    this.currentPage = response.page; // Actualizar currentPage con el número de página actual
                    this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
                    this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
                    this.loading = false; // Establecer loading en false al finalizar la carga
              

                    
        // Calcular la suma del campo monto_pagado
        this.sumaMontoPagado = this.listCronogramaPagos.reduce((sum, cronograma) => sum + Number(cronograma.monto_pagado), 0);

          console.log(this.sumaMontoPagado);
                    // Verificar si listCronogramaPagos está vacía
                    if (this.listCronogramaPagos.length === 0) {
                      this.toastr.warning('No se encontraron préstamos con ese DNI.', '', { positionClass: 'toast-top-right' }); // Mostrar toast de alerta en la parte superior derecha
                    }
                  },
                  error => {
                    console.error('Error al buscar cronogramas de pagos:', error);
                    this.loading = false; // Manejar el error y establecer loading en false
                  }
                );
              }
              
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.buscarPagos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


    // Método para eliminar la búsqueda
    eliminarBusqueda() {
      // Lógica para eliminar la búsqueda, si es necesario
      this.listCronogramaPagos = []; // Limpiar la lista de clientes
    }

              getListPrestamos() {
                // this.loading = true;
              
                // this._ticketService.getListTicketPrestamo(id).subscribe((response: any) => {
                //   this.listPrestamos = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
                //   this.loading = false;
                //   console.log(this.listPrestamos);
                // });
              }

              getTipoPagos(): void {
                this.loading = true;
                this._TipoPagoService.getListTipopagos().subscribe(
                  (response: any) => {
                    this.ListTipoPagos = response;
                    this.loading = false;
                  },
                  error => {
                    console.error('Error al obtener los tipos de pago:', error);
                    this.toastr.error('Error al obtener los tipos de pago');
                    this.loading = false;
                  }
                );
              }
              

              // getListTicketsPrestamos(idprestamo: number) {
              //   this.loading = true;
              
              //   this._ticketService.getListTicketPrestamo(idprestamo).subscribe((response: any) => {
              //     this.listTicketsPrestamo = response; // Asigna los datos de clientes del objeto devuelto por el servicio
              //     this.nombresempleado = response.Empleado.nombre +" " +response.Empleado.apellidos ;
              //     this.empleadoid = response.Empleado.id;
              //     this.estadopago = response.idpago;
                  
              //     this.montoRestante = response.Pago?.monto_restante ?? this.selectedCronogramapagos?.Prestamo.monto_pago ?? 0;
                 
              //     console.log ("ver monto restante " + this.montoRestante);
              //     this.loading = false;
              //   });
              // }

              getListTicketsPrestamos(idprestamo: number) {
                this.loading = true;
              
                this._ticketService.getListTicketPrestamo(idprestamo).subscribe(
                  (response: any) => {
                    this.listTicketsPrestamo = response;
                    this.nombresempleado = `${response.Empleado.nombre} ${response.Empleado.apellidos}`;
                    this.empleadoid = response.Empleado.id;
                    this.estadopago = response.idpago;
              
                   
                    this.loading = false;
                  },
                  error => {
                    console.error('Error al obtener los tickets del préstamo:', error);
                    this.loading = false;
                  }
                );
              }


              
             

              onTipoPagoSelected(event: any): void {
                const selectedTipoPagoId = event.target.value;
                if (selectedTipoPagoId === "4") {
                  this.formPago.get('pago').enable(); // Habilita el campo pago
                } else {
                  this.formPago.get('pago').disable(); // Deshabilita el campo pago
                }
              }

              montoprueba() {
                  this.monto_inicial = this.monto_prestamo / 1.20;
                  this.interes = this.monto_prestamo - this.monto_inicial;
                  this.montoRestanteFinal = this.monto_prestamo - this.sumaMontoPagado;
                
                
                }
            
              setSelectedPago(cronogramapagos: CronogramaPago) {
                this.selectedCronogramapagos = cronogramapagos;
                this.id = cronogramapagos.Prestamo.id;
                this.setMontoRestanInicial();
              
                this.monto_prestamo = cronogramapagos.Prestamo.monto_prestamo || 0;
                this.monto_pago = cronogramapagos.Prestamo.monto_pago || 0;
                this.montoprueba();
              
                if (cronogramapagos.Prestamo.Articulo.Categoria.id === 1) {
                  this.descripcionArticuloSeleccionado = `${cronogramapagos.Prestamo.Articulo.Vehiculo.descripcion} ${cronogramapagos.Prestamo.Articulo.Vehiculo.marca} ${cronogramapagos.Prestamo.Articulo.Vehiculo.modelo} ${cronogramapagos.Prestamo.Articulo.Vehiculo.placa}`;
                } else if (cronogramapagos.Prestamo.Articulo.Categoria.id === 2) {
                  this.descripcionArticuloSeleccionado = `${cronogramapagos.Prestamo.Articulo.Electrodomestico.descripcion} ${cronogramapagos.Prestamo.Articulo.Electrodomestico.marca} ${cronogramapagos.Prestamo.Articulo.Electrodomestico.modelo} ${cronogramapagos.Prestamo.Articulo.Electrodomestico.numero_serie}`;
                }
              
                this.formPago.patchValue({
                  fecha_pago: this.fechaActual,
                  idprestamo: cronogramapagos.Prestamo.id,
                  fecha_prestamo: cronogramapagos.Prestamo.fecha_prestamo,
                  fecha_devolucion: cronogramapagos.Prestamo.fecha_devolucion,
                  monto_prestamo: cronogramapagos.Prestamo.monto_prestamo,
                });
              
                this.estado = "pendiente";
              
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
                const prestamo: Partial<Prestamo> = {
                  estado: this.estado
                };
              
                console.log('Prestamo a actualizar:', prestamo); // Agregar registro de cliente a actualizar
                console.log('ID del Prestamo a actualizar:', this.selectedCronogramapagos.Prestamo.id); // Agregar registro del ID del cliente a actualizar
              
                this.loading = true;
              
                const prestamoId = this.selectedCronogramapagos.Prestamo.id;
                this._prestamosService.updatePrestamoEstado(prestamoId, prestamo).subscribe(
                  () => {
                   
              
                    this.loading = false;
              
                    console.log('Préstamo actualizado con éxito'); // Registro de cliente actualizado con éxito
                  },
                  error => {
                    console.error('Error al actualizar el Préstamo:', error); // Manejo de errores
                    this.toastr.error('Hubo un error al actualizar el Préstamo', 'Error');
                    this.loading = false;
                  }
                );
              }
              calcularMontoRestante(){
                const pagado = this.formPago.get('pago').value;
                this.montoRestante = this.montoRestanteFinal - pagado;
                this.pagoPrestamo = this.formPago.get('pago').value;
                // Verificar si el monto restante es igual a cero para establecer el estado como 'pagado'
                if (this.montoRestante === 0) {
                  this.estado = "pagado";
                }

              }



              addPago() {
                this.calcularMontoRestante();
                this.updatePrestamo();
                

                const pago: Pago = {
                  id_tipopago: this.formPago.value.id_tipopago,
                  fecha_pago: this.fechaActual,
                  interes_pago: this.interesfinal,
                  monto_restante: this.montoRestante,
                  capital_pago: this.capital_pago
                  // ... Otros campos del formulario de articulo según la interfaz
                };
              
                const idprestamo = this.selectedCronogramapagos.Prestamo.id;
                const cronogramPagos: CronogramaPago = {
                  id_prestamo: idprestamo,
                  fecha_pago: this.fechaActual, // Cambié `this.fecha_pago` a `this.fechaActual` para consistencia
                  monto_pagado: this.pagoPrestamo
                };
              
                this.loading = true;
              
                // Actualizar cronograma de pagos
                this._cronogramaService.updateCronogramaPago(this.idcronogramapagos, cronogramPagos).pipe(
                  tap(() => {
                    console.log('Monto pago actualizado con éxito');
                  }),
                  switchMap(() => {
                    // Guardar el pago
                    return this._pagoService.savePago(pago).pipe(
                      tap((response: Pago) => {
                        this.toastr.success(`El pago fue registrado con éxito`, 'Pago registrado');
                      }),
                      switchMap((response: Pago) => {
                        const idPago = response.id;
              
                        // Crear el ticket después de guardar el pago
                        const ticket: Ticket = {
                          num_serie: '', // Asegúrate de generar o asignar correctamente estos valores
                          num_ticket: '',
                          idempleado: this.empleadoid,
                          idpago: idPago,
                          idprestamo: this.selectedCronogramapagos.Prestamo.id
                        };
              
                        return this._ticketService.saveTicket(ticket).pipe(
                          switchMap((ticketGuardado: Ticket) => {
                            return this._ticketService.getTicket(ticketGuardado.id);
                          }),
                          tap((ticketGuardado: Ticket) => {
                            this.listTickets.push(ticketGuardado); // Agregar el ticket guardado a la lista
                            const lastIndex = this.listTickets.length - 1;
                            this.onImprimirFila(lastIndex); // Imprimir fila del último ticket agregado
                          })
                        );
                      })
                    );
                  })
                ).subscribe(
                  () => {
                    // Aquí puedes redirigir o manejar la lógica adicional después de imprimir el ticket
                    this.loading = false;
                    this.guardarPago();
                    this.router.navigate(['admin/pagos-list']);
                  },
                  error => {
                    console.error('Error al procesar el pago:', error);
                    this.toastr.error('Hubo un error al procesar el pago', 'Error');
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
        // prestamo.Empleado?.nombre + ' ' + prestamo.Empleado?.apellidos,
        prestamo.Articulo ? (prestamo.Articulo.Vehiculo ? prestamo.Articulo.Vehiculo.descripcion : (prestamo.Articulo.Electrodomestico ? prestamo.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
        prestamo.fecha_prestamo,
        prestamo.fecha_devolucion,
        prestamo.monto_prestamo,
        prestamo.monto_pago,
        prestamo.Articulo?.observaciones,
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
      // cliente: pago.Prestamo.Cliente?.nombre +" " + pago.Prestamo.Cliente?.apellido || '',
      // dni: pago.Prestamo.Cliente?.dni || '',
      // empleado:pago.Prestamo.Empleado?.nombre +" " + pago.Prestamo.Empleado?.apellidos || '',
      // articulo: pago.Prestamo?.Articulo ? (pago.Prestamo?.Articulo.Vehiculo ? pago.Prestamo?.Articulo.Vehiculo.descripcion :  (pago.Prestamo?.Articulo.Electrodomestico ? pago.Prestamo?.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
      // tipo_pago: pago.tipo_pago || '',
      // fecha_pago: this.formatDate(pago.fecha_pago) || '',
      // interes_pago: pago.interes_pago || '',
      // monto_restante: pago.monto_restante || '',
      // capital_pago: pago.capital_pago || '',
      // estado: pago.Prestamo?.estado || ''
    } );
  }

  
  

  onImprimirFila(index: number) {
    const ticket = this.listTickets[index];
    this.impresionService.imprimirFilaPrestamos('Ticket', {
      num_serie: ticket.num_serie,
      num_ticket: ticket.num_ticket,
      cliente: ticket.Prestamo?.Cliente?.nombre +" " + ticket.Prestamo?.Cliente?.apellido || '',
      dni: ticket.Prestamo?.Cliente?.dni || '',
      empleado: ticket.Empleado?.nombre +" " + ticket.Empleado?.apellidos || '',
      articulo: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.descripcion : (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
      fechaPrestamo: this.formatDate(ticket.Prestamo?.fecha_prestamo) || '',
      fechaDevolucion: this.formatDate(ticket.Prestamo?.fecha_devolucion) || '',
      montoPrestamo: ticket.Prestamo?.monto_prestamo || '',
      montoPago: ticket.Prestamo?.monto_pago || '',
      observaciones: ticket.Prestamo?.Articulo?.observaciones|| '',
      estado:ticket.Prestamo?.estado || ''
    } );
  }


  formatDate(date: string | Date): string {
    // Utiliza la función formatDate de Angular para formatear la fecha
    // Consulta la documentación de Angular para opciones de formato: https://angular.io/api/common/formatDate
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
  


}
