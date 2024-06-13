import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { VentaService } from 'src/app/services/venta.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { Comprobante_venta } from 'src/app/interfaces/comprobante_venta.interface';
import { ComprobanteventaService } from 'src/app/services/comprobanteventa.service';
import { DetaventaService } from 'src/app/services/detaventa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotaCreditoService } from 'src/app/services/notacredito.service';
import { NotaCredito } from 'src/app/interfaces/notacredito.interface';
import { mergeMap, tap,switchMap } from 'rxjs/operators';
import { Venta } from 'src/app/interfaces/venta.interface';





@Component({
  selector: 'app-venta-search',
  templateUrl: './venta-search.component.html',
  styleUrls: ['./venta-search.component.css']
})
export class VentaSearchComponent implements OnInit {


  ventas: Venta[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listVentas: Venta[] = []
  loading: boolean = false;

  listTiposNotasCreditos: NotaCredito [] = [];
  listdetalleVentas: DetalleVenta[] = [];
  listcomprobanteVenta: Comprobante_venta[] = [];
  listBoleta:  Comprobante_venta[] = [];
  listFactura:  Comprobante_venta[] = [];
  listNotaCredito:  Comprobante_venta[] = [];
  selectedComprobante: Comprobante_venta | null = null;
  categoriaSeleccionada: number = 0; 
  formanular: FormGroup;

  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private _ventasService: VentaService, 
    private _notacreditoService: NotaCreditoService,
    private _detalleventaService: DetaventaService,
    private _comprobanteventaService: ComprobanteventaService,
    private _paginacionService: PaginacionService
    , private toastr: ToastrService,
     private impresionService: ImpresionService) {

// Inicializar los formularios en el constructor
this.formanular = this.fb.group({
  id_Venta: [{ value: '', disabled: true }, Validators.required],
  igv: [{ value: '', disabled: true }, Validators.required],
  descuento: [{ value: '', disabled: true }, Validators.required],
  id_tipo_comprobante: [{ value: '', disabled: true }, Validators.required],
  num_serie: [{ value: '', disabled: true }, Validators.required],
  estado: [{ value: '', disabled: true }, Validators.required],
  razon_anulacion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
  id_nota_credito:['', Validators.required],
  // total: ['', Validators.required],
});




     }


     ngOnInit(): void {


     }


 


  deleteVenta(id: number) {
    this.loading = true;
    this._ventasService.deleteVenta(id).subscribe(() => {
      this.buscarVentas();
      this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
    })
  }



  
  getListNotaCreditos() {
    this.loading = true;
  
    this._notacreditoService.getListNotasCredito().subscribe(
      (response: any) => {
        this.listTiposNotasCreditos = response;
        this.loading = false; // Finalizar el estado de carga cuando se obtiene la respuesta
      },
      (error: any) => {
        console.error('Error al obtener la lista de notas de crédito:', error);
        this.toastr.error('Error al obtener la lista de notas de crédito', 'Error');
        this.loading = false; // Finalizar el estado de carga en caso de error
      }
    );
  }

  setSelectedComprobante(comprobante: Comprobante_venta) {
    this.selectedComprobante = comprobante;
  
   
      // Establecer los valores del cliente seleccionado en el formulario
      this.formanular.patchValue({
        id_Venta: comprobante.idventa,
        igv: comprobante.igv,
        descuento: comprobante.descuento,
        id_tipo_comprobante: comprobante.TipoComprobante?.nombre,
        num_serie: comprobante.num_serie,
        estado: comprobante.estado,

      });
      this.getListNotaCreditos();

      // Resetear el estado de validación del formulario
      this.formanular.markAsUntouched();
      this.mostrarAnulacion();
      console.log('Estado del formulario:', this.formanular.valid);
   
  }

  

  onCategoriaSelected(event: any) {
    const selectedCategoryId = Number(event.target.value);
    this.categoriaSeleccionada = selectedCategoryId;
this.buscarVentas();
  }



  buscarVentas() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.toastr.warning('Por favor, ingrese un término de búsqueda.', 'Advertencia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
      this.loading = false; // Asegurarse de que el indicador de carga esté oculto
      return;
    }
  
    this.loading = true; // Establecer loading en true para mostrar la carga
  
    this.searchService.searchComprobanteVenta(this.currentPage, this.pageSize, this.terminoBusqueda).subscribe(
      (response: any) => {
        console.log('Comprobante Ventas Response:', response); // Debugging line
        this.listcomprobanteVenta = response.data;
  
        if (this.listcomprobanteVenta.length === 0) {
          this.toastr.info('No se encontraron datos.', 'Información', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
  
        // Inicializar listas vacías
        this.listBoleta = [];
        this.listFactura = [];
        this.listNotaCredito = [];
  
        // Filtrar los resultados en función del tipo de comprobante
        this.listBoleta = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 1);
        this.listFactura = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 2);
        this.listNotaCredito = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 3);
  
        // Aplicar la categoría seleccionada para determinar qué lista mostrar
        if (this.listBoleta.length > 0) {
          this.categoriaSeleccionada = 1;
          this.listcomprobanteVenta = this.listBoleta;
        } else if (this.listFactura.length > 0) {
          this.categoriaSeleccionada = 2;
          this.listcomprobanteVenta = this.listFactura;
        } else if (this.listNotaCredito.length > 0) {
          this.categoriaSeleccionada = 3;
          this.listcomprobanteVenta = this.listNotaCredito;
        }
  
        // Actualizar la paginación en función de la lista filtrada
        this.totalItems = this.listcomprobanteVenta.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  
        this.loading = false; // Establecer loading en false una vez que los datos se han cargado
      },
      error => {
        console.error('Error al buscar comprobantes de venta:', error);
        this.toastr.error('Ocurrió un error al buscar los comprobantes de venta.', 'Error', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        this.loading = false; // Manejar el error y establecer loading en false
      }
    );
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.ventas = []; // Limpiar la lista de empleado
  }

  addComprobanteVenta() {
    const comprobante: Comprobante_venta = {
      idventa: this.selectedComprobante.idventa,
      igv: 0, // Puedes calcular el IGV aquí si es necesario
      descuento: 0, // Puedes calcular el descuento aquí si es necesario
      idtipo_comprobante: 3, // Asigna el ID del tipo de comprobante
      num_serie: "", // Asigna el número de serie (reemplaza con el valor adecuado)
      estado: "EMITIDO",
      razon_anulacion: this.formanular.value.razon_anulacion,
      idnotacredito: this.formanular.value.id_nota_credito,
      // Otros campos que necesites para el comprobante de venta
    };
  
    this._comprobanteventaService.saveComprobanteventa(comprobante).subscribe(
      () => {
        this.toastr.success('NOTA DE CREDITO fue registrado con éxito', 'NOTA DE CREDITO registrado', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
  
        this.guardarANULACION();
        this.updateComprobante();
        this.buscarVentas();
      },
      error => {
        // Manejar errores aquí
        console.error('Error al registrar el comprobante de venta:', error);
        this.toastr.error('Ocurrió un error al registrar el comprobante de venta', 'Error', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
      }
    );
  }


  updateComprobante() {
    const comprobante: Partial<Comprobante_venta> = {
      
      estado: 'ANULADO',
      
    };
  
    console.log('Comprobante a actualizar:', comprobante); // Agregar registro del comprobante a actualizar
  
  
      console.log('ID del comprobante a actualizar:', this.selectedComprobante.id); // Agregar registro del ID del comprobante a actualizar
  
      this.loading = true;
  
      this._comprobanteventaService.updateComprobanteventaEstado(this.selectedComprobante.id, comprobante).subscribe(() => {
        this.toastr.info(`El comprobante fue ANULADO con éxito`, 'Comprobante ANULADO', {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right' // Posición del toastr en la pantalla
        });
  
        this.loading = false;
  
        console.log('Comprobante actualizado con éxito'); // Registro del comprobante actualizado con éxito
      }, error => {
        console.error('Error al actualizar el comprobante:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar el comprobante', 'Error');
        this.loading = false;
      });
  
  }

  shouldDisableButton(comprobante: any): boolean {
    console.log("Comprobante:", comprobante);
    const estado = comprobante.estado.toLowerCase().trim();
    console.log("Estado:", estado);
    return estado === 'anulado';
  }

  mostrarAnulacion() {
    const modal = document.getElementById('ModalAnulacion');
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


  guardarANULACION() {
    const modal = document.getElementById('ModalAnulacion');
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





  
  onImprimir() {
    const entidad = 'Ventas';
    const encabezado = this.getEncabezado();
    const cuerpo = this.getCuerpo();
    const titulo = 'Lista de Ventas';
    const cuerpoUnico = this.eliminarFilasDuplicadas(cuerpo);
    this.impresionService.imprimir(entidad, encabezado, cuerpoUnico, titulo, true);
  }

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

  

 
  // Método para obtener el encabezado de la tabla
  getEncabezado(): string[] {
    const encabezado: string[] = [];
    document.querySelectorAll('table thead th').forEach((th: HTMLTableHeaderCellElement) => {
      const texto = th.textContent.trim();
      if (texto !== 'ACTUALIZAR' && texto !== 'ELIMINAR' && texto !== 'IMPRIMIR' &&  texto !== 'ANULACION') {
        encabezado.push(texto);
      }
    });
    return encabezado;
  }

  getCuerpo(): any[][] {
    const cuerpo: any[][] = [];
    const filasVistas = new Set();


    if(this.categoriaSeleccionada === 1 ){
    this.listcomprobanteVenta.forEach((comprobante) => {
      const fila: any[] = [
        comprobante.id,
        comprobante.TipoComprobante?.nombre,
        comprobante.Venta?.Empleado?.nombre + ' ' + comprobante.Venta?.Empleado?.apellidos,
        comprobante.Venta?.Cliente?.nombre,
        // comprobante.Articulo ?
        //   (comprobante.Articulo.Vehiculo ?
        //     comprobante.Articulo.Vehiculo.descripcion :
        //     (comprobante.Articulo.Electrodomestico ?
        //       comprobante.Articulo.Electrodomestico.descripcion :
        //       'No hay descripción disponible')) :
        //   'No hay descripción disponible',
          comprobante.Venta?.fecha_venta,
          comprobante.Venta?.tipo_pago,
          // comprobante.cantidad,
          // comprobante.precio_unitario,
          // comprobante.subtotal,
          comprobante.Venta?.total,
          comprobante.estado,

      ];
      const filaString = fila.join('|');
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });

   }

   
   if(this.categoriaSeleccionada === 2 ){
    this.listcomprobanteVenta.forEach((comprobante) => {
      const fila: any[] = [
        comprobante.id,
        comprobante.TipoComprobante?.nombre,
        comprobante.Venta?.Empleado?.nombre + ' ' + comprobante.Venta?.Empleado?.apellidos,
        comprobante.Venta?.Cliente?.razon_social,
        // comprobante.Articulo ?
        //   (comprobante.Articulo.Vehiculo ?
        //     comprobante.Articulo.Vehiculo.descripcion :
        //     (comprobante.Articulo.Electrodomestico ?
        //       comprobante.Articulo.Electrodomestico.descripcion :
        //       'No hay descripción disponible')) :
        //   'No hay descripción disponible',
          comprobante.Venta?.fecha_venta,
          comprobante.Venta?.tipo_pago,
          // comprobante.cantidad,
          // comprobante.precio_unitario,
          // comprobante.subtotal,
          comprobante.Venta?.total,
          comprobante.estado,

      ];
      const filaString = fila.join('|');
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });

   }


   if(this.categoriaSeleccionada === 3 ){
    this.listcomprobanteVenta.forEach((comprobante) => {
      const fila: any[] = [
        comprobante.id,
        comprobante.TipoComprobante?.nombre,
        comprobante.Venta?.Empleado?.nombre + ' ' + comprobante.Venta?.Empleado?.apellidos,
        comprobante.Venta?.Cliente?.nombre,
        // comprobante.Articulo ?
        //   (comprobante.Articulo.Vehiculo ?
        //     comprobante.Articulo.Vehiculo.descripcion :
        //     (comprobante.Articulo.Electrodomestico ?
        //       comprobante.Articulo.Electrodomestico.descripcion :
        //       'No hay descripción disponible')) :
        //   'No hay descripción disponible',
          comprobante.Venta?.fecha_venta,
          comprobante.razon_anulacion,
          // comprobante.cantidad,
          // comprobante.precio_unitario,
          // comprobante.subtotal,
          comprobante.NotaCredito?.descripcion,

  // comprobante.subtotal,
          comprobante.estado,
      ];
      const filaString = fila.join('|');
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });

   }


    return cuerpo;
  }

  
  async onImprimirFila(index: number) {
    const comprobante = this.listcomprobanteVenta[index];
    const idventa = comprobante.idventa;
    const tipo_comprobante = comprobante.idtipo_comprobante;
  
    try {
      // Obtener el comprobante de venta
      const comprobante = await this._comprobanteventaService.getComprobanteventabyVentaID(idventa).toPromise();
  
      // Obtener los detalles de venta
      const detallesVenta: DetalleVenta[] = await this._detalleventaService.getDetaventabyIdVenta(idventa).toPromise();
  
      if ( tipo_comprobante === 1 ){
        this.imprimirFila(comprobante, detallesVenta);
       }else if  ( tipo_comprobante === 2 ){
        this.imprimirFilaF(comprobante, detallesVenta);
    
       }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }
  
  private imprimirFila(comprobante: Comprobante_venta, detallesVenta: DetalleVenta[]) {
    const empleadoNombre = comprobante.Venta?.Empleado?.nombre || '';
    const empleadoApellidos = comprobante.Venta?.Empleado?.apellidos || '';
    const clienteNombre = comprobante.Venta?.Cliente?.nombre || '';
    const clienteApellido = comprobante.Venta?.Cliente?.apellido || '';
    const clienteDNI = comprobante.Venta?.Cliente?.dni || '';
  
    const detalleventa = detallesVenta.map(detalle => {
      let descripcion = 'No hay descripción disponible';
      let marca = 'No hay marca disponible';
      let modelo = 'No hay modelo disponible';
      let cantidad = 0;
      let precio_unitario = 0;
      let subtotal = 0;
  
      if (detalle.Articulo) {
        
  
        if (detalle.Articulo.Vehiculo) {
          cantidad = detalle.cantidad;
        precio_unitario = detalle.precio_unitario;
        subtotal = detalle.subtotal;
          descripcion = detalle.Articulo.Vehiculo.descripcion || '';
          marca = detalle.Articulo.Vehiculo.marca || '';
          modelo = detalle.Articulo.Vehiculo.modelo || '';
        } else if (detalle.Articulo.Electrodomestico) {
          descripcion = detalle.Articulo.Electrodomestico.descripcion || '';
          marca = detalle.Articulo.Electrodomestico.marca || '';
          modelo = detalle.Articulo.Electrodomestico.modelo || '';
          cantidad = detalle.cantidad;
          precio_unitario = detalle.precio_unitario;
          subtotal = detalle.subtotal;
        }
      }
  
      return {
        cantidad,
        precio_unitario,
        subtotal,
        descripcion,
        marca,
        modelo
      };
    });
  
    this.impresionService.imprimirFilaVentas('Ventas', {
      empleado: `${empleadoNombre} ${empleadoApellidos}`,
      cliente: `${clienteNombre} ${clienteApellido}`,
      detalleventa,
      dni: clienteDNI,
      fecha_venta: comprobante.Venta?.fecha_venta || '',
      tipo_pago: comprobante.Venta?.tipo_pago || '',
      total: comprobante.Venta?.total || '',
      igv: comprobante.igv || 0,
      descuento: comprobante.descuento || 0,
      tipo_comprobante: comprobante.TipoComprobante?.nombre || '',
      serie: comprobante.num_serie || ''
    });
  }

  
private imprimirFilaF(comprobante: Comprobante_venta, detallesVenta: DetalleVenta[]) {
  const empleadoNombre = comprobante.Venta?.Empleado?.nombre || '';
  const empleadoApellidos = comprobante.Venta?.Empleado?.apellidos || '';
  const clienteNombre = comprobante.Venta?.Cliente?.nombre || '';
  const clienteApellido = comprobante.Venta?.Cliente?.apellido || '';
  const clienteDNI = comprobante.Venta?.Cliente?.dni || '';

  const detalleventa = detallesVenta.map(detalle => {
    let descripcion = 'No hay descripción disponible';
    let marca = 'No hay marca disponible';
    let modelo = 'No hay modelo disponible';
    let cantidad = 0;
    let precio_unitario = 0;
    let subtotal = 0;

    if (detalle.Articulo) {
      

      if (detalle.Articulo.Vehiculo) {
        cantidad = detalle.cantidad;
      precio_unitario = detalle.precio_unitario;
      subtotal = detalle.subtotal;
        descripcion = detalle.Articulo.Vehiculo.descripcion || '';
        marca = detalle.Articulo.Vehiculo.marca || '';
        modelo = detalle.Articulo.Vehiculo.modelo || '';
      } else if (detalle.Articulo.Electrodomestico) {
        descripcion = detalle.Articulo.Electrodomestico.descripcion || '';
        marca = detalle.Articulo.Electrodomestico.marca || '';
        modelo = detalle.Articulo.Electrodomestico.modelo || '';
        cantidad = detalle.cantidad;
        precio_unitario = detalle.precio_unitario;
        subtotal = detalle.subtotal;
      }
    }

    return {
      cantidad,
      precio_unitario,
      subtotal,
      descripcion,
      marca,
      modelo
    };
  });

  this.impresionService.imprimirFilaVentasF('Ventas', {
    empleado: `${empleadoNombre} ${empleadoApellidos}`,
    razon_social:  comprobante.Venta?.Cliente.razon_social || '',
    detalleventa,
    ruc:  comprobante.Venta?.Cliente.ruc || '',
    fecha_venta: comprobante.Venta?.fecha_venta || '',
    tipo_pago: comprobante.Venta?.tipo_pago || '',
    total: comprobante.Venta?.total || '',
    igv: comprobante.igv || 0,
    descuento: comprobante.descuento || 0,
    tipo_comprobante: comprobante.TipoComprobante?.nombre || '',
    serie: comprobante.num_serie || ''
  });
}
  
  getDetalleVentaByIdVenta(idventa: number) {
    this._detalleventaService.getDetaventabyIdVenta(idventa).subscribe(
      (detallesVenta: DetalleVenta[]) => { // Cambiado a detallesVenta en plural
        this.listdetalleVentas = detallesVenta; // Asignar los detalles de venta obtenidos directamente
        console.log('Detalles de venta por ID de venta:', detallesVenta);
        // Llamar a la función para imprimir la fila una vez que los detalles de la venta estén disponibles
        const comprobante = this.listcomprobanteVenta.find(comprobante => comprobante.idventa === idventa);
        if (comprobante) {
          this.imprimirFila(comprobante, this.listdetalleVentas); // Pasar listdetalleVentas que ahora contiene todos los detalles de venta
        }
      },
      (error) => {
        console.error('Error al obtener los detalles de la venta:', error);
      }
    );
  }


}



