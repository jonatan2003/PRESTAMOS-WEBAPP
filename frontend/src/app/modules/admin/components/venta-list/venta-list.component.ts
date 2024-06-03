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
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number;
  totalPages: number = 0;

  constructor(
    private _ventaService: VentaService, 
    private _detalleventaService: DetaventaService,
    private _comprobanteventaService: ComprobanteventaService,
    private _paginacionService: PaginacionService,
    private toastr: ToastrService,
    private impresionService: ImpresionService
  ) {}

  ngOnInit(): void {
    
    this.getListComprobanteventas();
  }


  getListComprobanteventas() {
    this.loading = true;
    this._paginacionService.getListDetaVentas(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        console.log('Comprobante Ventas Response:', response);  // Debugging line
        this.listdetalleVentas = response.data;
        this.totalPages = response.totalPages;
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
      title: 'Eliminar Venta',
      text: '¿Estás seguro de que deseas eliminar esta venta?',
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


  obtenerDatos(idventa: number) {
    this._comprobanteventaService.getComprobanteventabyVentaID(idventa).subscribe((comprobante: Comprobante_venta) => {
      // Guardar el resultado en this.listcomprobanteVentas
      const index = this.listcomprobanteVenta.findIndex(c => c.idventa === idventa);
      if (index !== -1) {
        this.listcomprobanteVenta[index] = comprobante;
      } else {
        this.listcomprobanteVenta.push(comprobante);
      }
    });


    this._detalleventaService.getDetaventabyIdVenta(idventa).subscribe((detalleventa : DetalleVenta[]) => {
    this.listdetalleVentas.push(detalleventa[0]);

    });
  }

  
  async onImprimirFila(index: number) {
    const detalleVenta = this.listdetalleVentas[index];
    const idventa = detalleVenta.idventa;
  
    try {
      // Obtener el comprobante de venta
      const comprobante = await this._comprobanteventaService.getComprobanteventabyVentaID(idventa).toPromise();
  
      // Obtener los detalles de venta
      const detallesVenta: DetalleVenta[] = await this._detalleventaService.getDetaventabyIdVenta(idventa).toPromise();
  
      // Imprimir la fila con los datos obtenidos
      this.imprimirFila(comprobante, detallesVenta);
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
  
    const articulos = detallesVenta.map(detalle => {
      let descripcion = 'No hay descripción disponible';
      let marca = 'No hay marca disponible';
      let modelo = 'No hay modelo disponible';
  
      if (detalle.Articulo) {
        if (detalle.Articulo.Vehiculo) {
          descripcion = detalle.Articulo.Vehiculo.descripcion || '';
          marca = detalle.Articulo.Vehiculo.marca || '';
          modelo = detalle.Articulo.Vehiculo.modelo || '';
        } else if (detalle.Articulo.Electrodomestico) {
          descripcion = detalle.Articulo.Electrodomestico.descripcion || '';
          marca = detalle.Articulo.Electrodomestico.marca || '';
          modelo = detalle.Articulo.Electrodomestico.modelo || '';
        }
      }
  
      return {
        descripcion,
        marca,
        modelo
      };
    });
  
    this.impresionService.imprimirFilaVentas('Ventas', {
      empleado: `${empleadoNombre} ${empleadoApellidos}`,
      cliente: `${clienteNombre} ${clienteApellido}`,
      articulos,
      dni: clienteDNI,
      fecha_venta: comprobante.Venta?.fecha_venta || '',
      tipo_pago: comprobante.Venta?.tipo_pago || '',
      cantidad: detallesVenta.reduce((sum, detalle) => sum + (detalle.cantidad || 0), 0),
      precio_unitario: detallesVenta.reduce((sum, detalle) => sum + (detalle.precio_unitario || 0), 0),
      subtotal: detallesVenta.reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0),
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