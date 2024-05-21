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
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';
import { DetaventaService } from 'src/app/services/detaventa.service';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { formatDate } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reservation-finished',
  templateUrl: './reservation-finished.component.html',
  styleUrls: ['./reservation-finished.component.css']
})
export class ReservationFinishedComponent  {
  fechaActual: Date;
  formVenta: FormGroup;
  formcliente: FormGroup;
  formElectrodomestico: FormGroup;
  formVehiculo: FormGroup;
  id: number;
  listPrestamos: Prestamo[] = [];
  listdetalleVentas: DetalleVenta[] = [];
  loading: boolean = false;
  encabezado: string[] = [];
  cuerpo: string[][] = [];
  selectedPrestamo: Prestamo | null = null;
// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0
idprestamo: number = 0;
idarticulo: number = 0;
idcliente : number = 0;
idempleado: number = 0;
ventaid: number;
  monto_pago: number ;
  monto_prestamo: number;
nombreClienteSeleccionado: string ;
idClienteSeleccionado: number  | null = null;
descripcionArticuloSeleccionado: string ;
nombresempleado: string;
tipo_pagoSeleccionado: string;
interes: number;
pagoPrestamo: number;
estado : string ;

  constructor(private authService: AuthService,
    private _paginacionService: PaginacionService,
    private _categoriasService: CategoriaService,
   private _electrodomesticoService: ElectrodomesticoService,
   private _ventaService : VentaService,
   private _detalleventaService : DetaventaService,
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



    this.formVenta = this.fb.group({
      
      idempleado: [{ value: '',disabled: true }, ],
      idcliente: [{ value: '',disabled: true }, ],
      idarticulo: [{ value: '',disabled: true }, ],
      fecha_venta:  [{ value: '',disabled: true }, ],
      monto_prestamo:  [{ value: '', disabled: true }, ],
      tipo_pago: ['', Validators.required],
      idventa:  [{ value: '', disabled: true }, ],
  cantidad: [Validators.required,{ value: '', disabled: true }, ],
  precio_unitario: ['', Validators.required],
  total: [Validators.required,{ value: '', disabled: true }, ],
      // ... Otros campos del formulario de articulos
    });

    this.formcliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.maxLength(40)],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      telefono: ['', [, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      rubro: ['', ],
      // ... Otros campos del formulario de clientes
    });

  
    this.id = Number(aRouter.snapshot.paramMap.get('id'));


   }

               ngOnInit(): void {
                this.fechaActual = new Date();
                const fechaFormateada = this.formatoFecha(this.fechaActual);
                this.formVenta.get('fecha_venta').setValue(fechaFormateada);

                this.getListPrestamos();
             
                  // Observador para detectar cambios en precio_unitario y cantidad
    this.formVenta.get('precio_unitario').valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    this.formVenta.get('cantidad').valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }
  formatoFecha(fecha: Date): string {
    // Formatear la fecha como 'yyyy-MM-dd'
    return fecha.toISOString().slice(0, 10); // 'yyyy-MM-dd'
  }

  calcularTotal() {
    const precioUnitario = this.formVenta.get('precio_unitario').value;
    const cantidad = this.formVenta.get('cantidad').value;

    if (precioUnitario && cantidad) {
      const total = precioUnitario * cantidad;
      this.formVenta.get('total').setValue(total);
    } else {
      this.formVenta.get('total').setValue('');
    }
  }

  


              getListPrestamos() {
                this.loading = true;
              
                // Ajusta el método para aceptar parámetros de paginación
                this._paginacionService.getListPrestamosVentas(this.currentPage, this.pageSize).subscribe((response: any) => {
                  this.listPrestamos = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
                  this.loading = false;
                 console.log(this.listPrestamos);
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

            

              setSelectedVenta(prestamo: Prestamo) {
                this.selectedPrestamo = prestamo;
              // this.nombreClienteSeleccionado = prestamo.Cliente.nombre + " " +prestamo.Cliente.apellido ;
            //  this.nombresempleado = prestamo.Empleado.nombre + " " +prestamo.Empleado.apellidos ;
             this.estado = "pendiente";
             this.formVenta.get('cantidad').setValue(1);
             this.formVenta.get('monto_prestamo').setValue(prestamo.monto_prestamo);
            //  this.idempleado = prestamo.idempleado;
              this.idprestamo = prestamo.id;




               
                  this.id = prestamo.id;
                  // Establecer los valores del cliente seleccionado en el formulario
                   if(prestamo.Articulo.Categoria.id === 1){

                    this.descripcionArticuloSeleccionado = prestamo.Articulo.Vehiculo.descripcion + " " 
                  +prestamo.Articulo.Vehiculo.marca + " " 
                   +prestamo.Articulo.Vehiculo.modelo + " " +prestamo.Articulo.Vehiculo.placa;
                   this.monto_pago = prestamo.monto_pago;
                   this.monto_prestamo = prestamo.monto_prestamo;
                  this.idarticulo = prestamo.idarticulo;
                  


                  this.formVenta.patchValue({
                   

                  });

                }else if (prestamo.Articulo.Categoria.id === 2 ){

                  this.descripcionArticuloSeleccionado = prestamo.Articulo.Electrodomestico.descripcion + " " 
                  +prestamo.Articulo.Electrodomestico.marca + " " 
                   +prestamo.Articulo.Electrodomestico.modelo + " " +prestamo.Articulo.Electrodomestico.numero_serie;
                 this.monto_pago = prestamo.monto_pago;
                 this.monto_prestamo = prestamo.monto_prestamo;
                 this.idarticulo = prestamo.idarticulo;


                  
                 this.formVenta.patchValue({
                   

                 });

                }



                  // Resetear el estado de validación del formulario y establecer formularioModificado a false
                  this.formVenta.markAsUntouched();
                  this.mostrarModalVenta();
                  console.log('Estado del formulario:', this.formVenta.valid);
               
              }

              setSelectTipoVenta(event: any) {
                const selectetipo_pago = event.target.value;
                this.tipo_pagoSeleccionado = selectetipo_pago;
               
               
              
                // Verifica el valor de capital_pago dentro de este contexto
                console.log("Capital Pago dentro de setSelectTipodePago:", );
              }

              addDetalleVenta() {
                const detalleVenta: DetalleVenta = {
                  idventa: this.ventaid,
                  cantidad: 1,
                  precio_unitario: this.formVenta.value.precio_unitario,
                  subtotal: this.formVenta.value.total,
                };
              
                this.loading = true;
              
                this._detalleventaService.saveDetaventa(detalleVenta).pipe(
                  switchMap((response: any) => {
                    // Aquí puedes acceder al ID del detalle de venta guardado en 'response.id'
                    this.toastr.success(`La venta fue registrada con éxito`, 'VENTA REALIZADA');
                    this.loading = false;
              
                    // Llamar al servicio para obtener el detalle de venta por su ID
                    return this._detalleventaService.getDetaventa(response.id);
                  })
                ).subscribe(
                  (detalleVentaGuardado: DetalleVenta) => {
                    // Agregar el detalle de venta guardado a la lista de detalleVentas
                    this.listdetalleVentas.push(detalleVentaGuardado);
                    this.loading = false;
                   this.updatePrestamo();
                   this.guardarVenta();
                    // Obtener el índice del último elemento agregado
                    const lastIndex = this.listdetalleVentas.length - 1;
                    // Llamar a la función para imprimir fila del último pago agregado
                    this.onImprimirFila(lastIndex);
        
                    // Realizar cualquier acción adicional que necesites con el detalleVentaGuardado
                    // Por ejemplo, actualizar otras partes de tu aplicación o realizar cálculos adicionales
                    
                    // Redirigir después de guardar
                    this.router.navigate(['admin/venta-list']);
                  },
                  (error: any) => {
                    console.error('Error al guardar el detalle de venta:', error);
                    this.toastr.error('Error al guardar el detalle de venta', 'Error');
                    this.loading = false;
                  }
                );
              }
              


             addVenta(){
              
                const venta: Venta = 
                {
                  idempleado: this.idempleado,
                  idcliente: this.idClienteSeleccionado,
                  idarticulo: this.idarticulo,
                  fecha_venta: this.fechaActual,
                  tipo_pago: this.formVenta.value.tipo_pago,
                  total: this.formVenta.value.total


                };
                this.loading = true;
            
                this._ventaService.saveVenta(venta).subscribe(
                  (response: any) => { // Aquí se define 'response' como el parámetro de la función de suscripción
                    //this.toastr.success(`La venta fue registrado con éxito`, 'Vehículo registrado');
                    this.loading = false;
            
                    // Obtener el ID del vehículo desde la respuesta del servicio
                    this.ventaid = response.id;
            
                    // Asignar el valor de idelectrodomestico como null ya que no se está guardando un electrodoméstico
                    // Llamar a la función saveArticulo() después de obtener los IDs
                    this.addDetalleVenta();
                  },
                  (error: any) => { // Manejo de errores
                    console.error('Error al guardar el vehículo:', error);
                    this.toastr.error('Error al guardar el vehículo', 'Error');
                    this.loading = false;
                  }
                );
            
             }
             addCliente() {
              const cliente: Cliente = {
                nombre: this.formcliente.value.nombre,
                apellido: this.formcliente.value.apellido,
                direccion: this.formcliente.value.direccion,
                dni: this.formcliente.value.dni,
                ruc:  this.formcliente.value.dni,
                telefono: this.formcliente.value.telefono,
                rubro: this.formcliente.value.rubro,
                // ... Otros campos del formulario de clientes según la interfaz
              };
            
              this.loading = true;
            
                // Es agregar
                this._clientesService.saveCliente(cliente).subscribe((clienteid: Cliente) => {
                  
                 // this.toastr.success(`El cliente ${cliente.nombre} fue registrado con éxito`, 'Cliente registrado');
                  this.loading = false;
                  //this.router.navigate(['admin/client-list']);
                  this.idClienteSeleccionado = clienteid.id;
                 // Suponiendo que el objeto empleado tiene un campo 'id'
                
                  //this.idClienteSeleccionado = cliente.id;
                  this.nombreClienteSeleccionado = this.formcliente.value.nombre + " " +  this.formcliente.value.apellido  ;
                  //document.getElementById('ModalCliente').click();
                });
              this.guardarCliente();
            }
            



              mostrarModalVenta() {
                // Mostrar el modal
                const modal = document.getElementById('ModalVenta');
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
              
              mostrarModalCliente() {
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
                this.guardarVenta();
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
                 
                  idcliente: this.selectedPrestamo.idcliente,
                  // idempleado: this.selectedPrestamo.idempleado,
                  idarticulo:  this.selectedPrestamo.idarticulo,
                  fecha_prestamo:  this.selectedPrestamo.fecha_prestamo,
                  fecha_devolucion: this.selectedPrestamo.fecha_devolucion,
                  monto_prestamo: this.selectedPrestamo.monto_prestamo,
                  monto_pago: this.selectedPrestamo.monto_pago,
                  estado: "vendido"
                }; // Objeto de estado que contiene solo el nuevo estado 'venta'
            
                console.log('Prestamo a actualizar:', this.idprestamo, prestamo); // Registro para verificar qué préstamo y estado se actualizará
            
                if (this.idprestamo) {
                  this.loading = true;
            
                  this._prestamosService.updatePrestamo(this.idprestamo, prestamo).subscribe(
                    () => {
                      this.loading = false;
                      this,this.guardarVenta();

                      this.router.navigate(['/admin/venta-list']);
                      console.log('Prestamo actualizado con éxito'); // Éxito en la actualización del préstamo
                   //   this.toastr.success('Prestamo actualizado con éxito', 'Éxito');
                    },
                    (error) => {
                      console.error('Error al actualizar el Prestamo:', error); // Manejo de errores
                      this.toastr.error('Hubo un error al actualizar el Prestamo', 'Error');
                      this.loading = false;
                    }
                  );
                } else {
                  console.log('ID de Prestamo no válido:', this.idprestamo); // Manejo de ID no válido
                  this.toastr.error('ID de Prestamo no válido', 'Error');
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

              guardarCliente() {
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
                this.mostrarModalVenta();
              }



              guardarVenta() {
                // Aquí iría tu lógica para guardar el formulario

                // Luego, cierra el modal
                const modal = document.getElementById('ModalVenta');
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
    this.impresionService.imprimir(entidad, encabezado, cuerpo, titulo, true); // Llama al servicio de impresión
  }


  getEncabezado(): string[] {
    const encabezado: string[] = [];
    document.querySelectorAll('table thead th').forEach((th: HTMLTableHeaderCellElement) => {
      const texto = th.textContent.trim();
      if (texto !== 'ACTUALIZAR' && texto !== 'ELIMINAR' && texto !== 'IMPRIMIR' && texto !== 'PAGOS' ) {
        encabezado.push(texto);
      }
    });
    return encabezado;
  }

  getCuerpo(): string[][] {
    const cuerpo: string[][] = [];
    document.querySelectorAll('table tbody tr').forEach((tr: HTMLTableRowElement) => {
      const fila: string[] = [];
      tr.querySelectorAll('td').forEach((td: HTMLTableCellElement) => {
        const texto = td.textContent.trim();
        if (texto !== 'Actualizar' && texto !== 'Eliminar' && texto !== 'Imprimir'&& texto !== 'Pagos') {
          fila.push(texto);
        }
      });
      cuerpo.push(fila);
    });
    return cuerpo;
  }


  onImprimirFila(index: number) {
    const detalleventa = this.listdetalleVentas[index];
    this.impresionService.imprimirFilaVentas('Ventas', {
        empleado: detalleventa.Venta?.Empleado?.nombre +" " + detalleventa.Venta?.Empleado?.apellidos || '',
        cliente: detalleventa.Venta?.Cliente?.nombre || '',
        articulo: detalleventa.Venta?.Articulo ?
            (detalleventa.Venta?.Articulo.Vehiculo ?
                detalleventa.Venta?.Articulo.Vehiculo.descripcion :
                    (detalleventa.Venta?.Articulo.Electrodomestico ?
                        detalleventa.Venta?.Articulo.Electrodomestico.descripcion :
                            'No hay descripción disponible')) :
            'No hay descripción disponible',
            dni : detalleventa.Venta?.Cliente.dni,
        fecha_venta:  this.formatDate(detalleventa.Venta?.fecha_venta) || '',
        tipo_pago: detalleventa.Venta?.tipo_pago || '',
        cantidad: detalleventa.cantidad || '',
        precio_unitario: detalleventa.precio_unitario || '',
        subtotal: detalleventa.subtotal || '',
        total: detalleventa.Venta?.total || ''
    });
}
  

formatDate(date: string | Date): string {
  // Utiliza la función formatDate de Angular para formatear la fecha
  // Consulta la documentación de Angular para opciones de formato: https://angular.io/api/common/formatDate
  return formatDate(date, 'yyyy-MM-dd', 'en-US');
}





}
