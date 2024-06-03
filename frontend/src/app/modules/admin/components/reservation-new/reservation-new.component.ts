import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ArticulosService } from 'src/app/services/articulo.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrestamoService } from 'src/app/services/prestamo.service';

import { Prestamo } from 'src/app/interfaces/prestamo.interface';
import { Date } from 'core-js';

import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ElectrodomesticoService } from 'src/app/services/electrodomestico.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { Electrodomestico } from 'src/app/interfaces/electrodomestico.interface';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';

import { AuthService } from 'src/app/services/auth.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { formatDate } from '@angular/common';
import { ApiDniService } from 'src/app/services/apidni.service';
import { ApiRucService } from 'src/app/services/apiruc.service';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { CronogramaPagosService } from 'src/app/services/cronograma_pagos.service';
import { CronogramaPago } from 'src/app/interfaces/cronograma_pagos.interface';



@Component({
  selector: 'app-reservation-new',
  templateUrl: './reservation-new.component.html',
  styleUrls: ['./reservation-new.component.css']
})
export class ReservationNewComponent {
// formulario ARTICULO
  categorias: Categoria[] = []; // Variable para almacenar los productos disponibles
  listCategorias: Categoria[] = [];
  listElectrodomesticos: Electrodomestico [] = [];
  listPrestamos: Prestamo[] = [];
  listVehiculos: Vehiculo []  = [];
  formarticulo: FormGroup;
  categoriaSeleccionada: number; // Variable para almacenar la categoría seleccionada
  formVehiculo: FormGroup;
  formElectrodomestico: FormGroup;
  nombresempleado : string ;
  id_empleado : number ;
 vehiculoId: number | null = null;;
 electrodomesticoId: number | null = null;
  listTicket : Ticket [] = [];
//..--------------


formcliente: FormGroup; 
  form: FormGroup;
  // loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

  fechaActual: Date;
id_cliente = null;
id_articulo = null;



  clientes: Cliente[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listClientes: Cliente[] = []
  loading: boolean = false;

  articulos: Articulo[] = [];
  listArticulos: Articulo[] = []
 
  
  idArticuloSeleccionado: number  | null = null;
  listEmpleados: Empleado[] = []


  clienteSeleccionado: any;
   articuloSeleccionado: any;
   empleadoSeleccionado: any;

   nombreClienteSeleccionado: string = '';
   
    idClienteSeleccionado: number  | null = null;

  descripcionArticuloSeleccionado: string = '';
  


  constructor(
    private ticketService : TicketService,
    private _electrodomesticoService: ElectrodomesticoService,
    private _CronogramaPagos: CronogramaPagosService,
    private apiDniService: ApiDniService, 
    private apiRucService: ApiRucService,
    private _vehiculoService: VehiculoService,
    private fb: FormBuilder,
    private searchService: SearchService,
    private _clientesService: ClienteService,
    private _articulosService: ArticulosService,
    private impresionService: ImpresionService,
    private _prestamosService: PrestamoService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute )
    {
      this.form = this.fb.group({
      id_cliente: ['', Validators.required , ],
      id_articulo: ['', Validators.required],
      fecha_devolucion: ['', Validators.required],
      monto_prestamo: ['', Validators.required],
      tasa_interes: [{ value: '', disabled: true }, ],
    });

    this.formcliente = this.fb.group({
      tipoCliente: ['dni'],
      nombre: [{ value: '', disabled: true }, Validators.required],
      apellido: [{ value: '', disabled: true }, Validators.required],
      direccion: [{ value: '', disabled: true }, Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      ruc: ['', [Validators.required, , Validators.maxLength(11), Validators.pattern("^[0-9]*$")]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      rubro: ['', [Validators.required, Validators.maxLength(25), ]],
    });
  


    this.formVehiculo = this.fb.group({
      carroceria: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      numero_serie: ['', Validators.required],
      numero_motor: ['', Validators.required],
      placa: ['', Validators.required],
      descripcion: ['', Validators.required],
      observaciones: ['', Validators.required],
    });

    this.formElectrodomestico = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      numero_serie: ['', Validators.required],
      descripcion: ['', Validators.required],
      observaciones: ['', Validators.required],

    });

    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.id_empleado = parseInt(localStorage.getItem('id_empleado'));
    this.nombresempleado = localStorage.getItem('nombresempleado');
   
}

ngOnInit(): void {
// Obtener la fecha actual
this.fechaActual = new Date();
// Formatear la fecha actual en el formato de fecha de HTML5 (YYYY-MM-DD)
const fechaActualString = this.fechaActual.toISOString().slice(0, 10);
// Establecer la fecha actual como valor inicial del campo de formulario
this.onTipoClienteChange();


  if (this.id !== 0) {
    // Es editar
    this.operacion = 'Editar';
   

  }

  // this.getListCategorias();
}


onTipoClienteChange() {
  const tipoCliente = this.formcliente.get('tipoCliente').value;
  if (tipoCliente === 'ruc') {
    this.formcliente.controls['dni'].disable();
    this.formcliente.controls['ruc'].enable();
    this.formcliente.controls['nombre'].enable();
    this.formcliente.controls['apellido'].enable();
    this.formcliente.controls['direccion'].enable();
    this.formcliente.controls['rubro'].enable();
    this.formcliente.controls['dni'].enable();

  } else {
    this.formcliente.controls['ruc'].disable();
    this.formcliente.controls['dni'].enable();
    this.formcliente.controls['nombre'].enable();
    this.formcliente.controls['apellido'].enable();
    this.formcliente.controls['direccion'].enable();
    this.formcliente.controls['rubro'].enable();
  }
}

onDniChange() {
  const dni = this.formcliente.get('dni').value;
  if (dni.length === 8) {
    this.toastr.info('Buscando DNI...', 'Información');
    this.apiDniService.getClienteByDni(dni).subscribe(data => {
    this.toastr.info('DNI ENCONTRADO', 'Información');

      const responseData = data; // Acceder al objeto 'body'
      this.formcliente.patchValue({
        nombre: responseData.nombres, // Acceder a las propiedades dentro de 'body'
        apellido: responseData.apellidoPaterno + "  " + responseData.apellidoMaterno,
        razon_social: "no"
        // direccion: responseData.desDireccion,
      });
    }, error => {
      this.toastr.error('DNI DESCONOCIDO', 'NO ENCONTRADO');
      console.error(error);
    });
  }
}

onRucChange() {
  const ruc = this.formcliente.get('ruc').value;
  if (ruc.length === 11) {
    this.toastr.info('Buscando RUC...', 'Información');
    this.apiRucService.getClienteByDni(ruc).subscribe(data => {
      this.toastr.info('RUC ENCONTRADO', 'Información');
      this.formcliente.patchValue({
        nombre: "no",
        apellido: "no",
        direccion: data.direccion,
        razon_social: data.nombre
        // rubro: data.rubro
      });
    }, error => {
      this.toastr.error('RUC DESCONOCIDO', 'NO ENCONTRADO');
      console.error(error);
    });
  }
}



addPrestamo() {
  if (this.loading) return; // Evitar múltiples ejecuciones si ya está en progreso

  const prestamo: Prestamo = {
    idcliente: this.form.value.id_cliente,
    idarticulo: this.form.value.id_articulo,
    fecha_prestamo: this.fechaActual,
    fecha_devolucion: this.form.value.fecha_devolucion,
    monto_prestamo: this.form.value.monto_prestamo,
    monto_pago: this.form.value.monto_prestamo,
    estado: 'pendiente'
  };

  this.loading = true;

  this._prestamosService.savePrestamo(prestamo).pipe(
    switchMap((response: Prestamo) => {
      this.toastr.success(`El préstamo fue registrado con éxito`, 'Préstamo registrado');
      const idprestamo = response.id;

      const ticket: Ticket = {
        num_serie: '', // Asegúrate de generar o asignar correctamente estos valores
        num_ticket: '',
        idempleado: this.id_empleado,
        idpago: null,
        idprestamo: idprestamo,
      };

      return this.ticketService.saveTicket(ticket);
    }),
    switchMap((ticketGuardado: Ticket) => {
      return this.ticketService.getTicket(ticketGuardado.id);
    })
  ).subscribe((ticketGuardado: Ticket) => {
    this.loading = false;
    this.listTicket.push(ticketGuardado); // Agregar el ticket guardado a la lista
    const lastIndex = this.listTicket.length - 1;
    // Llamar a la función para imprimir fila del último pago agregado
    this.onImprimirFila(lastIndex);

   // this.toastr.success(`El ticket fue registrado con éxito`, 'Ticket registrado');
    this.router.navigate(['admin/reservation-list']);
  }, error => {
    console.error('Error al procesar la solicitud:', error);
    this.toastr.error('Hubo un error al procesar la solicitud', 'Error');
    this.loading = false;
  });
}


addCliente() {
  const cliente: Cliente = {
    nombre: this.formcliente.value.nombre,
    apellido: this.formcliente.value.apellido,
    direccion: this.formcliente.value.direccion,
    dni: this.formcliente.value.dni,
    ruc: this.formcliente.value.ruc,
    razon_social: this.formcliente.value.razon_social,
     telefono: this.formcliente.value.telefono,
    rubro: this.formcliente.value.rubro,
    // ... Otros campos del formulario de clientes según la interfaz
  };

  this.loading = true;

    // Es agregar
    this._clientesService.saveCliente(cliente).subscribe((clienteid: Cliente) => {
      
      this.loading = false;
      //this.router.navigate(['admin/client-list']);
      this.idClienteSeleccionado = clienteid.id;
      this.form.get('id_cliente').setValue(this.idClienteSeleccionado); // Suponiendo que el objeto empleado tiene un campo 'id'
      this.toastr.success(`El Cliente  fue registrado con éxito`, 'Cliente registrado', {
        timeOut: 2000, // Duración en milisegundos (2 segundos en este caso)
        progressBar: true, // Muestra la barra de progreso
        progressAnimation: 'increasing', // Animación de la barra de progreso
        positionClass: 'toast-top-right' // Posición del toastr en la pantalla
      });
      //this.idClienteSeleccionado = cliente.id;
      this.nombreClienteSeleccionado = this.formcliente.value.nombre + " " +  this.formcliente.value.apellido  ;
      this.guardarCliente();
    });
  
}



saveArticulo() {
  let idcategoria: number;
  // let id: number ; // Inicializarlo como null al agregar un nuevo artículo
  let idvehiculo: number | null;
  let idelectrodomestico: number | null;
  let observaciones: string
  let estado : "";
  // Obtener ID de categoría seleccionada
  idcategoria = this.categoriaSeleccionada;

  // Obtener ID de vehículo o electrodoméstico según la categoría seleccionada
  if (idcategoria === 1) {
    idvehiculo = this.vehiculoId;
    observaciones = this.formVehiculo.value.observaciones;
    idelectrodomestico = null;
  } else if (idcategoria === 2) {
    idvehiculo = null;
    observaciones = this.formElectrodomestico.value.observaciones;
    idelectrodomestico = this.electrodomesticoId;
  } else {
    // Manejar el caso si la categoría no está seleccionada correctamente
    return;
  }

  // Crear objeto Articulo con los IDs obtenidos
  const nuevoArticulo: Articulo = {
    idcategoria,
   //  id, // Se deja como null al agregar un nuevo artículo
    idvehiculo,
    idelectrodomestico,
    estado: "prestamo",
    observaciones

    // Agrega otras propiedades necesarias aquí
  };

  // Guardar el artículo utilizando el servicio ArticulosService
  this._articulosService.saveArticulo(nuevoArticulo).subscribe((response: any) => {  //articuloid: Articulo
    // Redireccionar a la lista de artículos u otro lugar según sea necesario
    //this.router.navigate(['/admin/reservation-new']);
    // this.idArticuloSeleccionado = articuloid.id;
    
    this.idArticuloSeleccionado = response.id;
    this.form.get('id_articulo').setValue(this.idArticuloSeleccionado);

    this.guardarArticulo();
  }, error => {
    // Manejar errores si la operación de guardar falla
    console.error('Error al guardar el artículo:', error);
    //this.toastr.error('Error al guardar el artículo', 'Error');

  });
}





onCategoriaSelected(event: any) {
  const selectedCategoryId = Number(event.target.value);
  this.categoriaSeleccionada = selectedCategoryId;
}


addVehiculo() {
  const vehiculo: Vehiculo = this.formVehiculo.value;
  this.loading = true;

  this._vehiculoService.saveVehiculo(vehiculo).subscribe(
    (response: any) => { // Aquí se define 'response' como el parámetro de la función de suscripción
      this.toastr.success(`El vehículo ${vehiculo.descripcion} fue registrado con éxito`, 'Vehículo registrado', {
        timeOut: 2000, // Duración en milisegundos (2 segundos en este caso)
        progressBar: true, // Muestra la barra de progreso
        progressAnimation: 'increasing', // Animación de la barra de progreso
        positionClass: 'toast-top-right' // Posición del toastr en la pantalla
      });
      
      this.loading = false;

      // Obtener el ID del vehículo desde la respuesta del servicio
      this.vehiculoId = response.id;

      // Asignar el valor de idelectrodomestico como null ya que no se está guardando un electrodoméstico
      this.electrodomesticoId = null;
      this.descripcionArticuloSeleccionado = this.formVehiculo.value.descripcion;
      // Llamar a la función saveArticulo() después de obtener los IDs
      this.saveArticulo();
    

    },
    (error: any) => { // Manejo de errores
      console.error('Error al guardar el vehículo:', error);
      this.toastr.error('Error al guardar el vehículo', 'Error');
      this.loading = false;

    }
  );
}


addElectrodomestico() {
  const electrodomestico: Electrodomestico = this.formElectrodomestico.value;
  this.loading = true;

  this._electrodomesticoService.saveElectrodomestico(electrodomestico).subscribe(
    (response: any) => { // Aquí se define 'response' como el parámetro de la función de suscripción
      this.toastr.success(`El electrodoméstico ${electrodomestico.descripcion} fue registrado con éxito`, 'Electrodoméstico registrado', {
        timeOut: 2000, // Duración en milisegundos (2 segundos en este caso)
        progressBar: true, // Muestra la barra de progreso
        progressAnimation: 'increasing', // Animación de la barra de progreso
        positionClass: 'toast-top-right' // Posición del toastr en la pantalla
      });
      this.loading = false;

      // Obtener el ID del electrodoméstico desde la respuesta del servicio
      this.electrodomesticoId = response.id;

      // Asignar el valor de idvehiculo como null ya que no se está guardando un vehículo
      this.vehiculoId = null;
      this.descripcionArticuloSeleccionado = this.formElectrodomestico.value.descripcion;
      // Llamar a la función saveArticulo() después de obtener los IDs
      this.saveArticulo();


    },
    (error: any) => { // Manejo de errores
      console.error('Error al guardar el electrodoméstico:', error);
      this.toastr.error('Error al guardar el electrodoméstico', 'Error');
      this.loading = false;

    }
  );
}



limpiarFormulario() {
  this.formcliente.reset(); // Resetea el formulario a su estado inicial
}



  // // Método para realizar la búsqueda de clientes
  // buscarClientes() {
  //   this.searchService.searchClientes(this.terminoBusqueda)
  //     .subscribe(
  //       clientes => {
  //         this.clientes = clientes; // Asignar los resultados de la búsqueda a la propiedad clientes
  //       },
  //       error => {
  //         console.error('Error al buscar clientes:', error);
  //         // Maneja el error aquí
  //       }
  //     );
  // }


  // buscarArticulos() {
  //   this.searchService.searchArticulos(this.terminoBusqueda)
  //     .subscribe(
  //       articulos => {
  //         this.articulos = articulos; // Asignar los resultados de la búsqueda a la propiedad clientes
  //       },
  //       error => {
  //         console.error('Error al buscar articulos:', error);
  //         // Maneja el error aquí
  //       }
  //     );
  // }




  
  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.clientes = []; // Limpiar la lista de clientes
  }


//   seleccionarCliente(cliente: Cliente) {
//     this.clienteSeleccionado = cliente;
//     this.form.controls['idcliente'].setValue(cliente.id);
//     // this.clienteSeleccionado = cliente.nombre;
//     //  this.form.controls['cliente'].setValue(cliente.nombre); // Actualiza el nombre del cliente en el formulario
// }


  seleccionarArticulo(articulo: Articulo) {

     this.articuloSeleccionado = articulo;
    this.form.controls['id_articulo'].setValue(articulo.id);
    // this.limpiarFormularioYTabla(); // Llama a la función para limpiar el formulario y la tabla


    }

  seleccionarEmpleado(empleado: Empleado) {
  //  this.empleadoSeleccionado = empleado.nombre;
  //    this.form.controls['empleado'].setValue(empleado.nombre);
    this.empleadoSeleccionado = empleado;
     this.form.controls['id_empleado'].setValue(empleado.id);
    }

    mostrarCliente() {
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

    mostrarArticulo() {
      // Mostrar el modal
      const modal = document.getElementById('ModalArticulo');
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
    }

    guardarArticulo() {
      // Aquí iría tu lógica para guardar el formulario

      // Luego, cierra el modal
      const modal = document.getElementById('ModalArticulo');
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


getCuerpo(): string[][] {
  const cuerpo: string[][] = [];
  const textosExcluidos = new Set(['Actualizar', 'Eliminar', 'Imprimir', 'Pagos']); // Textos a excluir
  document.querySelectorAll('table tbody tr').forEach((tr: HTMLTableRowElement) => {
      const fila: string[] = [];
      tr.querySelectorAll('td').forEach((td: HTMLTableCellElement) => {
          const texto = td.textContent.trim();
          // Verificamos si el texto del TD no está en el conjunto de textos excluidos
          if (texto && !textosExcluidos.has(texto)) {
              fila.push(texto);
          }
      });
      cuerpo.push(fila);
  });
  return cuerpo;
}

  
onImprimirFila(index: number) {
  const ticket = this.listTicket[index];
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
