import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { ApiDniService } from 'src/app/services/apidni.service';
import { ApiRucService } from 'src/app/services/apiruc.service';
import { SearchService } from 'src/app/services/search.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { ArticulosService } from 'src/app/services/articulo.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ElectrodomesticoService } from 'src/app/services/electrodomestico.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { mergeMap, tap,switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Electrodomestico } from 'src/app/interfaces/electrodomestico.interface';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { DetaventaService } from 'src/app/services/detaventa.service';
import { Comprobante_venta } from 'src/app/interfaces/comprobante_venta.interface';
import { ComprobanteventaService } from 'src/app/services/comprobanteventa.service';
import { Inventario } from 'src/app/interfaces/inventario.interface';
import { InventarioService } from 'src/app/services/inventario.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';


@Component({
  selector: 'app-venta-new',
  templateUrl: './venta-new.component.html',
  styleUrls: ['./venta-new.component.css']
})
export class VentaNewComponent implements OnInit {
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listArticulos: Articulo[] = []
   listInventario : Inventario[] = []
   mostrarFormBoleta = false;
   mostrarFormFactura = false;
   listComprobantes : Comprobante_venta[] = []
   listDetalleVenta : DetalleVenta [] = []
  clienteSeleccionado: any;
  articuloSeleccionado: any;
  empleadoSeleccionado: any;
  inventarioSeleccionado: any;
 
  idelectrodomestico : number;
  idvehiculo : number;
  selectedInventario: Inventario[] = [];
  selectedArticulos: Articulo[] = [];
  articuloAgregado: boolean = false;
clienteAgregado: boolean = false;

  id_cliente = null;
id_articulo = null;

  categoriaSeleccionada: number = 0; // Variable para almacenar la categoría seleccionada
  listCategorias: Categoria[] = [];
  listArticulosVehiculos: Articulo[] = [];
  listArticulosElectrodomesticos: Articulo[] = [];
  loadingVehiculos: boolean = false;
  loadingElectrodomesticos: boolean = false;
  formVehiculo: FormGroup;
  formElectrodomestico: FormGroup;


  empleados: Empleado[] = [];
  listEmpleados: Empleado[] = [];
  clientes: Cliente[] = [];
  listClientes: Cliente[] = [];


    // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0


  nombreClienteSeleccionado: string = '';
  idClienteSeleccionado: number | null = null;
  formcliente: FormGroup; 
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';
  nombresempleado: string;
  id_empleado: number;
  descripcionArticulo: string = '';
  modeloArticulo: string = '';
  marcaArticulo: string = '';
  serieArticulo: string = '';


  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;


  constructor(private searchService: SearchService,
    private _articulosService: ArticulosService, 
    private _inventarioService: InventarioService,
    private fb: FormBuilder,
    private _empleadosService: EmpleadoService,
    private _clientesService: ClienteService,
    private _ventasService: VentaService,
    private router: Router,
    private toastr: ToastrService,
    private apiDniService: ApiDniService, 
    private apiRucService: ApiRucService,
    private aRouter: ActivatedRoute,
    private _electrodomesticoService: ElectrodomesticoService, 
    private _vehiculoService: VehiculoService,
    private _detaventasService: DetaventaService,
    private _comprobanteventasService: ComprobanteventaService,
    private impresionService: ImpresionService

  ) {
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.id_empleado = parseInt(localStorage.getItem('id_empleado') || '0');
    this.nombresempleado = localStorage.getItem('nombresempleado') || '';

    // Inicializar los formularios en el constructor
    this.form = this.fb.group({
      id_empleado: [{ value: '', disabled: true }, Validators.required],
      id_cliente: [ Validators.required],
      id_articulo: [{ value: '', disabled: true }, Validators.required],
      fecha_venta: [{ value: '', disabled: true }, Validators.required],
      // monto_total: [{ value: '', disabled: false }, [Validators.required]],
      tipo_pago: [{ value: '', disabled: false }, Validators.required],
    });

    this.formcliente = this.fb.group({
      tipoCliente: ['dni'],
      nombre: [{ value: '', disabled: true }, Validators.required],
      apellido: [{ value: '', disabled: true }, Validators.required],
      direccion: [{ value: '', disabled: true }, Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      ruc: ['', [Validators.required, Validators.maxLength(11), Validators.pattern("^[0-9]*$")]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      rubro: ['', [Validators.required, Validators.maxLength(25)]],
    });
  }

  ngOnInit(): void {
    this.onTipoClienteChange();
    const fechaActual = new Date();
    const fechaActualString = fechaActual.toISOString().slice(0, 10);
    this.form.patchValue({ fecha_venta: fechaActualString });

    if (this.id !== 0) {
      this.operacion = 'Editar';
      // this.getVenta(this.id);
    }
    this.getListEmpleados();
    this.getListClientes();
    this.getListArticulos();

  }

  getListArticulos() {
    this.loading = true;

    this._articulosService.getListArticulos().subscribe((data: Articulo[]) => {
      this.listArticulos = data;
      this.loading = false;
    })
  }

  
   // Método para realizar la búsqueda de clientes
   buscarArticulos() {
    this.loading = true; // Establecer loading en true para mostrar la carga

  this.searchService.searchInventario(this.currentPage, this.pageSize, this.terminoBusqueda).subscribe(
    (response: any) => {
      this.listInventario = response.data; // Asignar los datos de empleados a la propiedad empleados
      this.loading = false; // Establecer loading en false al finalizar la carga
      this.currentPage = response.page; // Actualizar currentPage con el número de página actual
      this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
      this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
 console.log(this.listInventario);
    },
    error => {
      console.error('Error al buscar articulos:', error);
      this.loading = false; // Manejar el error y establecer loading en false
    }
  );
  }


    
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.buscarArticulos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // seleccionarArticulo(articulo: Articulo) {
  //   this.articuloSeleccionado = articulo;
  //   this.descripcionArticulo = articulo.Electrodomestico?.descripcion || articulo.Vehiculo?.descripcion;
  //   this.modeloArticulo = articulo.Electrodomestico?.modelo || articulo.Vehiculo?.modelo;
  //   this.marcaArticulo = articulo.Electrodomestico?.marca || articulo.Vehiculo?.marca;
  //   this.serieArticulo = articulo.Electrodomestico?.numero_serie || articulo.Vehiculo?.numero_serie;
  //   this.form.patchValue({ idarticulo: articulo.id });
  // }

  seleccionarArticulo(inventario: Inventario): void {
    // Check if the article is already selected
    if (this.selectedInventario.some(item => item.Articulo.id === inventario.Articulo.id)) {
      console.log('¡El artículo ya ha sido seleccionado!');
      this.toastr.warning(
        `ARTICULO YA SELECCIONADO`,
        'ERROR',
        {
          timeOut: 3000, // Cambiado a 3000 milisegundos (3 segundos)
          extendedTimeOut: 0,
          closeButton: true,
          tapToDismiss: true,
          onActivateTick: true
        }
    );
  
      return; // Exit the function if the article is already selected
    }
  

    // If the article is not already selected, proceed to select it
    this.inventarioSeleccionado = inventario;
    this.descripcionArticulo = inventario.Articulo?.Electrodomestico?.descripcion || inventario.Articulo?.Vehiculo?.descripcion || '';
    this.modeloArticulo = inventario.Articulo?.Electrodomestico?.modelo || inventario.Articulo?.Vehiculo?.modelo || '';
    this.marcaArticulo = inventario.Articulo?.Electrodomestico?.marca || inventario.Articulo?.Vehiculo?.marca || '';
    this.serieArticulo = inventario.Articulo?.Electrodomestico?.numero_serie || inventario.Articulo?.Vehiculo?.numero_serie || '';
    this.form.patchValue({ id_articulo: inventario.Articulo.id });
  
    // Add the selected article to the list
    this.selectedInventario.push(inventario);
    this.calcularTotales();
    this.articuloAgregado = true;

  }
  eliminarArticulo(index: number): void {
    this.selectedInventario.splice(index, 1);
    this.calcularTotales();
    this.articuloAgregado = false;

}

calcularTotales(): void {
  this.subtotal = this.selectedInventario.reduce((total, inventario) => total + (inventario.valor_venta * inventario.stock), 0);
  this.igv = 0; // IGV es 0% en tu caso
  this.total = this.subtotal + this.igv;
}

  closeModal() {
    const modal = document.getElementById('ModaArticuloBuscar');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-modal', 'false');
      document.body.classList.remove('modal-open');
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }
    }
  }

  seleccionarEmpleado(empleado: Empleado) {
    //  this.empleadoSeleccionado = empleado.nombre;
    //    this.form.controls['empleado'].setValue(empleado.nombre);
      this.empleadoSeleccionado = empleado;
      this.id_empleado = empleado.id;

       this.form.controls['id_empleado'].setValue(empleado.id);
      }

  getListEmpleados() {
    this.loading = true;
    this._empleadosService.getListEmpleados().subscribe((data: Empleado[]) => {
      this.listEmpleados = data;
      this.loading = false;
    });
  }

  getListClientes() {
    this.loading = true;
    this._clientesService.getListClientes().subscribe((data: Cliente[]) => {
      this.listClientes = data;
      this.loading = false;
    });
  }

  // getVenta(id: number) {
  //   this.loading = true;
  //   this._ventasService.getVenta(id).subscribe((data: Venta) => {
  //     this.loading = false;
  //     this.form.patchValue({
  //       id_empleado: data.idempleado,
  //       id_cliente: data.idcliente,
  //       id_articulo: data.idarticulo,
  //       fecha_venta: data.fecha_venta,
  //       monto_total: data.total,
  //       tipo_pago: data.tipo_pago,
  //     });
  //   });
  // }




  mostrarCliente() {
    const modal = document.getElementById('ModalCliente');
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('fade');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  mostrarArticuloBuscar() {
    const modal = document.getElementById('ModaArticuloBuscar');
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('fade');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }


  guardarCliente() {
    const modal = document.getElementById('ModalCliente');
    if (modal) {
      modal.classList.remove('show', 'fade', 'showing');
      modal.style.display = 'none';
      modal.setAttribute('aria-modal', 'false');
      document.body.classList.remove('modal-open');
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  }

  addCliente() {
    const cliente: Cliente = {
      nombre: this.formcliente.value.nombre,
      apellido: this.formcliente.value.apellido,
      direccion: this.formcliente.value.direccion,
      dni: this.formcliente.value.dni,
      ruc: this.formcliente.value.ruc,
      telefono: this.formcliente.value.telefono,
      rubro: this.formcliente.value.rubro,
    };

    this.loading = true;
    this._clientesService.saveCliente(cliente).subscribe((clienteid: Cliente) => {
      this.loading = false;
      this.idClienteSeleccionado = clienteid.id;
      const idClienteControl = this.form.get('idcliente');
      if (idClienteControl) {
        idClienteControl.setValue(this.idClienteSeleccionado);
      }
      this.toastr.success('El Cliente fue registrado con éxito', 'Cliente registrado', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this.clienteAgregado = true;
      this.nombreClienteSeleccionado = `${this.formcliente.value.nombre} ${this.formcliente.value.apellido}`;
      this.guardarCliente();
    });
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
      this.apiDniService.getClienteByDni(dni).subscribe(data => {
        const responseData = data; // Acceder al objeto 'body'
        console.log("hol"+responseData);
        this.formcliente.patchValue({
          nombre: responseData.nombres, // Acceder a las propiedades dentro de 'body'
          apellido: responseData.apellidoPaterno + "  "+responseData.apellidoMaterno,
  //        direccion: responseData.desDireccion,
        });
      }, error => {
        this.toastr.info('DNI DESCONOCIDO', 'Título del error');
        console.error(error);
      });
    }
  }
  


  
  
  onRucChange() {
    const ruc = this.formcliente.get('ruc').value;
    if (ruc.length === 11) {
      this.apiRucService.getClienteByDni(ruc).subscribe(data => {
        this.formcliente.patchValue({
          nombre: data.nombre,
          direccion: data.direccion,
          // rubro: data.rubro
        });
      }, error => {
        this.toastr.info('RUC DESCONOCIDO', 'Título del error');
        console.error(error);
      });
    }
  }
// Dentro de tu componente
addVenta() {
  const venta: Venta = {
    idempleado: this.id_empleado,
    idcliente: this.idClienteSeleccionado,
    fecha_venta: this.form.get('fecha_venta').value,
    total: this.total, // Asegúrate de calcular el total correctamente
    tipo_pago: this.form.get('tipo_pago').value,
    // Otros campos que necesites para la venta
  };

  this.loading = true;
  this._ventasService.saveVenta(venta).pipe(
    switchMap((ventaCreada) => {
      this.toastr.success('La venta fue registrada con éxito', 'Venta registrada', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });

      // Luego de agregar la venta, guarda los detalles de la venta (productos)
      return this.addDetallesVenta(ventaCreada.id).pipe(
        switchMap(() => this.addComprobanteVenta(ventaCreada.id))
      );
    })
  ).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['admin/venta-list']);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error al registrar la venta:', err);
      this.toastr.error('Error al registrar la venta', 'Error', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }
  });
}

addDetallesVenta(idVenta: number) {
  const detallesVenta: DetalleVenta[] = this.selectedInventario.map((inventario: Inventario) => ({
    idventa: idVenta,
    idarticulo: inventario.Articulo.id,
    cantidad: inventario.stock,
    precio_unitario: inventario.valor_venta,
    subtotal: inventario.valor_venta,
    // Otros campos que necesites para el detalle de venta
  }));

  return this._detaventasService.saveDetaventa(detallesVenta).pipe(
    switchMap(() => this._detaventasService.getDetaventabyIdVenta(idVenta)),
    tap((detalleVenta) => {
      this.listDetalleVenta.push(detalleVenta);
      console.log('Detalle de venta por ID de venta:', detalleVenta);
    })
  );
}

addComprobanteVenta(idVenta: number) {
  const comprobante: Comprobante_venta = {
    idventa: idVenta,
    igv: 0, /* Calcula el valor del IGV */
    descuento: 0, /* Calcula el valor del descuento */
    idtipo_comprobante: 1, /* Asigna el ID del tipo de comprobante */
    num_serie: ""  /* Asigna el número de serie */,
    // Otros campos que necesites para el comprobante de venta
  };

  return this._comprobanteventasService.saveComprobanteventa(comprobante).pipe(
    switchMap((comprobanteCreado) => this._comprobanteventasService.getComprobanteventa(comprobanteCreado.id)),
    tap((comprobanteCompleto) => {
      this.toastr.success('El comprobante de venta fue registrado con éxito', 'Comprobante de venta registrado', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });

      this.listComprobantes.push(comprobanteCompleto);
      console.log(this.listComprobantes);
      this.onImprimirFila(this.listComprobantes.length - 1);
    })
  );
}

  mostrarFormularioBoleta(tipo: string): void {
    this.mostrarFormBoleta = true;
    this.mostrarFormFactura = false;

    // Additional logic if necessary for different form types
}
mostrarFormularioFactura(tipo: string): void {
  this.mostrarFormFactura = true;
  this.mostrarFormBoleta = false;
  // Additional logic if necessary for different form types


}


onImprimirFila(index: number) {
  const comprobante = this.listComprobantes[index];
  const detalleVenta = this.listDetalleVenta.find(detalle => detalle.idventa === comprobante.idventa);

  // Verificar si los detalles de la venta están disponibles
  if (detalleVenta) {
    // Los detalles de la venta están disponibles, proceder a la impresión
    this.imprimirFila(comprobante, detalleVenta);
  } else {
    // Los detalles de la venta no están disponibles, obtenerlos
    this.getDetalleVentaByIdVenta(comprobante.idventa);
  }
}

private imprimirFila(comprobante: Comprobante_venta, detalleVenta: DetalleVenta) {
  const empleadoNombre = comprobante.Venta?.Empleado?.nombre || '';
  const empleadoApellidos = comprobante.Venta?.Empleado?.apellidos || '';
  const clienteNombre = comprobante.Venta?.Cliente?.nombre || '';
  const clienteApellido = comprobante.Venta?.Cliente?.apellido || '';
  const clienteDNI = comprobante.Venta?.Cliente?.dni || '';

  let articuloDescripcion = 'No hay descripción disponible';
  let articuloMarca = 'No hay marca disponible';
  let articuloModelo = 'No hay modelo disponible';

  if (detalleVenta.Articulo) {
    if (detalleVenta.Articulo.Vehiculo) {
      articuloDescripcion = detalleVenta.Articulo.Vehiculo.descripcion || '';
      articuloMarca = detalleVenta.Articulo.Vehiculo.marca || '';
      articuloModelo = detalleVenta.Articulo.Vehiculo.modelo || '';
    } else if (detalleVenta.Articulo.Electrodomestico) {
      articuloDescripcion = detalleVenta.Articulo.Electrodomestico.descripcion || '';
      articuloMarca = detalleVenta.Articulo.Electrodomestico.marca || '';
      articuloModelo = detalleVenta.Articulo.Electrodomestico.modelo || '';
    }
  }

  this.impresionService.imprimirFilaVentas('Ventas', {
    empleado: `${empleadoNombre} ${empleadoApellidos}`,
    cliente: `${clienteNombre} ${clienteApellido}`,
    articulo: articuloDescripcion,
    marca: articuloMarca,
    modelo: articuloModelo,
    dni: clienteDNI,
    fecha_venta: comprobante.Venta?.fecha_venta || '',
    tipo_pago: comprobante.Venta?.tipo_pago || '',
    cantidad: detalleVenta.cantidad || '',
    precio_unitario: detalleVenta.precio_unitario || '',
    subtotal: detalleVenta.subtotal || '',
    total: comprobante.Venta?.total || '',
    igv: comprobante.igv || 0,
    descuento: comprobante.descuento || 0,
    tipo_comprobante: comprobante.TipoComprobante?.nombre || '',
    serie: comprobante.num_serie || ''
  });
}

// Agregar una función para obtener los detalles de la venta por ID de venta
getDetalleVentaByIdVenta(idventa: number) {
  this._detaventasService.getDetaventabyIdVenta(idventa).subscribe(
    (detalleVenta: DetalleVenta) => {
      this.listDetalleVenta.push(detalleVenta);
      console.log('Detalle de venta por ID de venta:', detalleVenta);
      // Llamar a la función para imprimir la fila una vez que los detalles de la venta estén disponibles
      const comprobante = this.listComprobantes.find(comprobante => comprobante.idventa === idventa);
      if (comprobante) {
        this.imprimirFila(comprobante, detalleVenta);
      }
    },
    (error) => {
      console.error('Error al obtener los detalles de la venta:', error);
    }
  );
}


// getDetalleVentaByIdVenta(idventa: number) {
//   this._detaventasService.getDetaventabyIdVenta(idventa).subscribe(
//     (detallesVenta: DetalleVenta[]) => {
//       detallesVenta.forEach(detalleVenta => {
//         this.listDetalleVenta.push(detalleVenta);
//         console.log('Detalle de venta por ID de venta:', detalleVenta);
//         const comprobante = this.listComprobantes.find(comprobante => comprobante.idventa === idventa);
//         if (comprobante) {
//           this.imprimirFila(comprobante, detalleVenta);
//         }
//       });
//     },
//     (error) => {
//       console.error('Error al obtener los detalles de la venta:', error);
//     }
//   );
// }

}
