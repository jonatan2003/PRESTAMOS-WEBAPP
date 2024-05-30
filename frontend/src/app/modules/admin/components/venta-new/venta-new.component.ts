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
import Swal from 'sweetalert2';
import { Electrodomestico } from 'src/app/interfaces/electrodomestico.interface';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { DetaventaService } from 'src/app/services/detaventa.service';
import { Comprobante_venta } from 'src/app/interfaces/comprobante_venta.interface';
import { ComprobanteventaService } from 'src/app/services/comprobanteventa.service';
import { Inventario } from 'src/app/interfaces/inventario.interface';
import { InventarioService } from 'src/app/services/inventario.service';


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

  clienteSeleccionado: any;
  articuloSeleccionado: any;
  empleadoSeleccionado: any;
  inventarioSeleccionado: any;
 
  idelectrodomestico : number;
  idvehiculo : number;
  selectedInventario: Inventario[] = [];
  selectedArticulos: Articulo[] = [];
  

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
    private _comprobanteventasService: ComprobanteventaService
  ) {
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.id_empleado = parseInt(localStorage.getItem('id_empleado') || '0');
    this.nombresempleado = localStorage.getItem('nombresempleado') || '';

    // Inicializar los formularios en el constructor
    this.form = this.fb.group({
      id_empleado: [{ value: '', disabled: true }, Validators.required],
      id_cliente: [{ value: '', disabled: true }, Validators.required],
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

  }
  eliminarArticulo(index: number): void {
    this.selectedInventario.splice(index, 1);
    this.calcularTotales();

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

  addVenta() {
    if (this.form.invalid) {
      this.toastr.error('Por favor, complete todos los campos del formulario', 'Error');
      return;
    }
  
    const venta: Venta = {
      idempleado: this.form.value.id_empleado,
      idcliente: this.form.value.id_cliente,
      idarticulo: this.form.value.id_articulo,
      fecha_venta: this.form.value.fecha_venta,
      total: this.form.value.monto_total,
      tipo_pago: this.form.value.tipo_pago,
    };
  
    this.loading = true;
  
    const saveOrUpdate = this.id !== 0 ?
      this._ventasService.updateVenta(this.id, venta) :
      this._ventasService.saveVenta(venta);
  
    saveOrUpdate.subscribe(
      () => {
        const mensaje = this.id !== 0 ? 'actualizada' : 'registrada';
        this.toastr.success(`La venta ${venta.idcliente} fue ${mensaje} con éxito`, `Venta ${mensaje}`);
        this.loading = false;
        this.router.navigate(['/admin/venta-list']);
      },
      error => {
        console.error('Error al registrar/actualizar la venta:', error);
        this.toastr.error('Ocurrió un error al guardar la venta', 'Error');
        this.loading = false;
      }
    );
  }
  



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


}
