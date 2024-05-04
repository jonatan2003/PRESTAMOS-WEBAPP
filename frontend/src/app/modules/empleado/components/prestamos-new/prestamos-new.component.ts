import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ArticulosService } from 'src/app/services/articulo.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';

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

@Component({
  selector: 'app-prestamos-new',
  templateUrl: './prestamos-new.component.html',
  styleUrls: ['./prestamos-new.component.css']
})
export class PrestamosNewComponent {
// formulario ARTICULO
  categorias: Categoria[] = []; // Variable para almacenar los productos disponibles
  listCategorias: Categoria[] = [];
  listElectrodomesticos: Electrodomestico [] = [];
  listVehiculos: Vehiculo []  = [];
  formarticulo: FormGroup;
  categoriaSeleccionada: number; // Variable para almacenar la categoría seleccionada
  formVehiculo: FormGroup;
  formElectrodomestico: FormGroup;
  nombresempleado : string ;
  id_empleado : number ;
 vehiculoId: number | null = null;;
 electrodomesticoId: number | null = null;

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
  


  constructor(private authService: AuthService,
     private _categoriasService: CategoriaService,
    private _electrodomesticoService: ElectrodomesticoService,
    private _vehiculoService: VehiculoService,
    private fb: FormBuilder,
    private searchService: SearchService,
    private _clientesService: ClienteService,
    private _articulosService: ArticulosService,
    private _empleadosService: EmpleadoService,

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
      observacion: ['', Validators.required],
    });

    this.formcliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      rubro: ['', Validators.required],
      // ... Otros campos del formulario de clientes
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
    });

    this.formElectrodomestico = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      numero_serie: ['', Validators.required],
      descripcion: ['', Validators.required],
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


  if (this.id !== 0) {
    // Es editar
    this.operacion = 'Editar';
   

  }
  // this.getListCategorias();

}


addPrestamo() {

  const prestamo: Prestamo = {
    idcliente: this.form.value.id_cliente,
    idempleado: this.id_empleado,
    idarticulo: this.form.value.id_articulo,
    fecha_prestamo: this.fechaActual,
    fecha_devolucion: this.form.value.fecha_devolucion,
    monto_prestamo: this.form.value.monto_prestamo,
    monto_pago: this.form.value.monto_prestamo,
    observacion: this.form.value.observacion,
    estado: "pendiente" 
    // ... Otros campos del formulario de articulo según la interfaz
  };





  this.loading = true;

  if (this.id !== 0) {
    // Es editar
    prestamo.id = this.id;
    this._prestamosService.updatePrestamo(this.id, prestamo).subscribe(() => {
      this.toastr.info(`El prestamo  fue actualizado con éxito`, 'prestamo actualizado');
      this.loading = false;
     // window.location.href = '/reservation-list';
      // this.router.navigate(['admin/reservation-list']);
    });
  } else {
    // Es agregar
    this._prestamosService.savePrestamo(prestamo).subscribe(() => {
      this.toastr.success(`El prestamo fue registrado con éxito`, 'prestamo registrado');
      this.loading = false;
     // window.location.href = '/reservation-list';
       this.router.navigate(['empleado/prestamos-list']);

    });
  }
}





addCliente() {
  const cliente: Cliente = {
    nombre: this.formcliente.value.nombre,
    apellido: this.formcliente.value.apellido,
    direccion: this.formcliente.value.direccion,
    dni: this.formcliente.value.dni,
    telefono: this.formcliente.value.telefono,
    rubro: this.formcliente.value.rubro,
    // ... Otros campos del formulario de clientes según la interfaz
  };

  this.loading = true;

    // Es agregar
    this._clientesService.saveCliente(cliente).subscribe((clienteid: Cliente) => {
      
      this.toastr.success(`El cliente ${cliente.nombre} fue registrado con éxito`, 'Cliente registrado');
      this.loading = false;
      //this.router.navigate(['admin/client-list']);
      this.idClienteSeleccionado = clienteid.id;
      this.form.get('id_cliente').setValue(this.idClienteSeleccionado); // Suponiendo que el objeto empleado tiene un campo 'id'
    
      //this.idClienteSeleccionado = cliente.id;
      this.nombreClienteSeleccionado = this.formcliente.value.nombre + " " +  this.formcliente.value.apellido  ;
      document.getElementById('ModalCliente').click();
    });
  
}



saveArticulo() {
  let idcategoria: number;
  // let id: number ; // Inicializarlo como null al agregar un nuevo artículo
  let idvehiculo: number | null;
  let idelectrodomestico: number | null;

  let estado = ""
  // Obtener ID de categoría seleccionada
  idcategoria = this.categoriaSeleccionada;

  // Obtener ID de vehículo o electrodoméstico según la categoría seleccionada
  if (idcategoria === 1) {
    idvehiculo = this.vehiculoId;
    idelectrodomestico = null;
  } else if (idcategoria === 2) {
    idvehiculo = null;
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
    estado : "prestamo" ,
    // Agrega otras propiedades necesarias aquí
  };

  // Guardar el artículo utilizando el servicio ArticulosService
  this._articulosService.saveArticulo(nuevoArticulo).subscribe((response: any) => {  //articuloid: Articulo
    // Redireccionar a la lista de artículos u otro lugar según sea necesario
    //this.router.navigate(['/admin/reservation-new']);
    // this.idArticuloSeleccionado = articuloid.id;
    this.idArticuloSeleccionado = response.id;
    this.form.get('id_articulo').setValue(this.idArticuloSeleccionado);

    document.getElementById('ModalItem').click();
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
      this.toastr.success(`El vehículo ${vehiculo.descripcion} fue registrado con éxito`, 'Vehículo registrado');
      this.loading = false;

      // Obtener el ID del vehículo desde la respuesta del servicio
      this.vehiculoId = response.id;

      // Asignar el valor de idelectrodomestico como null ya que no se está guardando un electrodoméstico
      this.electrodomesticoId = null;
      this.descripcionArticuloSeleccionado = this.formVehiculo.value.descripcion;
      // Llamar a la función saveArticulo() después de obtener los IDs
      this.saveArticulo();
    

      document.getElementById('ModalItem').click();
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
      this.toastr.success(`El electrodoméstico ${electrodomestico.descripcion} fue registrado con éxito`, 'Electrodoméstico registrado');
      this.loading = false;

      // Obtener el ID del electrodoméstico desde la respuesta del servicio
      this.electrodomesticoId = response.id;

      // Asignar el valor de idvehiculo como null ya que no se está guardando un vehículo
      this.vehiculoId = null;
      this.descripcionArticuloSeleccionado = this.formElectrodomestico.value.descripcion;
      // Llamar a la función saveArticulo() después de obtener los IDs
      this.saveArticulo();


      document.getElementById('ModalItem').click();
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



   
  

}
