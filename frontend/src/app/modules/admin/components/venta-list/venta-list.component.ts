import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from 'src/app/services/venta.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { Comprobante_venta } from 'src/app/interfaces/comprobante_venta.interface';
import { ComprobanteventaService } from 'src/app/services/comprobanteventa.service';
import { DetaventaService } from 'src/app/services/detaventa.service';

@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css']
})
export class VentaListComponent implements OnInit {

  listdetalleVentas: DetalleVenta[] = [];
  listcomprobanteVenta: Comprobante_venta[] = [];
  listBoleta:  Comprobante_venta[] = [];
  listFactura:  Comprobante_venta[] = [];
  listNotaCredito:  Comprobante_venta[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number;
  totalPages: number = 0;
  categoriaSeleccionada: number = 0; 


  constructor(
    private _ventaService: VentaService, 
    private _detalleventaService: DetaventaService,
    private _comprobanteventaService: ComprobanteventaService,
    private _paginacionService: PaginacionService,
    private toastr: ToastrService,
    private impresionService: ImpresionService
  ) {}

  ngOnInit(): void {
    
  }

  onCategoriaSelected(event: any) {
    const selectedCategoryId = Number(event.target.value);
    this.categoriaSeleccionada = selectedCategoryId;
this.getListComprobanteventas();
  }

  getListComprobanteventas() {
    this.loading = true;
    this._paginacionService.getListComprobanteventas(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        console.log('Comprobante Ventas Response:', response);  // Debugging line
        this.listcomprobanteVenta = response.data;
  
        // Inicializar listas vacías
        this.listBoleta = [];
        this.listFactura = [];
        this.listNotaCredito = [];
  
        // Filtrar los resultados en función del tipo de comprobante
        this.listBoleta = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 1);
        this.listFactura = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 2);
        this.listNotaCredito = this.listcomprobanteVenta.filter(comprobante => comprobante.idtipo_comprobante === 3);
  
        // Aplicar la categoría seleccionada para determinar qué lista mostrar
        if (this.categoriaSeleccionada === 1) {
          this.listcomprobanteVenta = this.listBoleta;
        } else if (this.categoriaSeleccionada === 2) {
          this.listcomprobanteVenta = this.listFactura;
        } else if (this.categoriaSeleccionada === 3) {
          this.listcomprobanteVenta = this.listNotaCredito;
        }
  
        // Actualizar la paginación en función de la lista filtrada
        this.totalItems = this.listcomprobanteVenta.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  
        // Mostrar mensaje si no se encontraron comprobantes del tipo seleccionado
        if (this.listcomprobanteVenta.length === 0) {
          this.toastr.warning('No se encontraron comprobantes del tipo seleccionado', 'Advertencia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
  
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching comprobante ventas:', error);
        this.loading = false;
      }
    );
  }
  
  pageChanged(page: number) {
    this.currentPage = page;

    this.getListComprobanteventas();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  deleteComprobante(id: number) {
    Swal.fire({
      title: 'Anular Venta',
      text: '¿Estás seguro de que deseas ANULAR esta venta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDeleteComprobante(id);
      }
    });
  }

  performDeleteComprobante(id: number) {
    this.loading = true;
    this._comprobanteventaService.deleteComprobanteventa(id).subscribe(() => {
     this.getListComprobanteventas();
      this.toastr.warning('La comprobante fue eliminada con éxito', 'Venta eliminada');
      this.loading = false;
    });
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

  

  getEncabezado(): string[] {
    return [
      'EMPLEADO',
      'CLIENTE',
      'ARTICULO',
      'FECHA VENTA',
      'TIPO PAGO',
      'CANTIDAD',
      'PRECIO UNITARIO',
      'SUBTOTAL',
      'TOTAL'
    ];
  }

  getCuerpo(): any[][] {
    const cuerpo: any[][] = [];
    const filasVistas = new Set();
    this.listdetalleVentas.forEach((venta) => {
      const fila: any[] = [
        venta.Venta?.Empleado?.nombre + ' ' + venta.Venta?.Empleado?.apellidos,
        venta.Venta?.Cliente?.nombre,
        venta.Articulo ?
          (venta.Articulo.Vehiculo ?
            venta.Articulo.Vehiculo.descripcion :
            (venta.Articulo.Electrodomestico ?
              venta.Articulo.Electrodomestico.descripcion :
              'No hay descripción disponible')) :
          'No hay descripción disponible',
        venta.Venta?.fecha_venta,
        venta.Venta?.tipo_pago,
        venta.cantidad,
        venta.precio_unitario,
        venta.subtotal,
        venta.Venta?.total
      ];
      const filaString = fila.join('|');
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });
    return cuerpo;
  }

  // obtenerDatos(idventa: number) {
  //   this._comprobanteventaService.getComprobanteventabyVentaID(idventa).subscribe((comprobante: Comprobante_venta) => {
  //     // Guardar el resultado en this.listcomprobanteVentas
  //     const index = this.listcomprobanteVenta.findIndex(c => c.idventa === idventa);
  //     if (index !== -1) {
  //       this.listcomprobanteVenta[index] = comprobante;
  //     } else {
  //       this.listcomprobanteVenta.push(comprobante);
  //     }
  //   });


  //   this._detalleventaService.getDetaventabyIdVenta(idventa).subscribe((detalleventa : DetalleVenta[]) => {
  //   this.listdetalleVentas.push(detalleventa[0]);

  //   });
  // }

  
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