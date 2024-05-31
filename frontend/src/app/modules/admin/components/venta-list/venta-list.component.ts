import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from 'src/app/services/venta.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { Comprobante_venta } from 'src/app/interfaces/comprobante_venta.interface';
import { ComprobanteventaService } from 'src/app/services/comprobanteventa.service';

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
    this._paginacionService.getListComprobanteventas(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        console.log('Comprobante Ventas Response:', response);  // Debugging line
        this.listcomprobanteVenta = response.data;
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

  onImprimirFila(index: number) {
    // const comprobante = this.listcomprobanteVenta[index];
    // this.impresionService.imprimirFilaVentas('Ventas', {
    //   empleado: comprobante.DetalleVenta?.Venta?.Empleado?.nombre + " " + comprobante?.DetalleVenta?.Venta?.Empleado?.apellidos || '',
    //   cliente: comprobante.DetalleVenta?.Venta?.Cliente?.apellido + " " +  comprobante.DetalleVenta?.Venta?.Cliente?.nombre|| '',
    //   articulo: comprobante.DetalleVenta.Articulo ?
    //     (comprobante.DetalleVenta?.Articulo.Vehiculo ?
    //       comprobante.DetalleVenta?.Articulo.Vehiculo.descripcion :
    //       (comprobante.DetalleVenta?.Articulo.Electrodomestico ?
    //         comprobante.DetalleVenta?.Articulo.Electrodomestico.descripcion :
    //         'No hay descripción disponible')) :
    //     'No hay descripción disponible',

    //    marca:comprobante.DetalleVenta?.Articulo ?
    //    (comprobante.DetalleVenta?.Articulo.Vehiculo ?
    //      comprobante.DetalleVenta?.Articulo.Vehiculo.marca :
    //      (comprobante.DetalleVenta?.Articulo.Electrodomestico ?
    //        comprobante.DetalleVenta?.Articulo.Electrodomestico.marca :
    //        'No hay marca disponible')) :
    //    'No hay marca disponible',

    //    modelo: comprobante.DetalleVenta?.Articulo ?
    //    (comprobante.DetalleVenta?.Articulo.Vehiculo ?
    //      comprobante.DetalleVenta?.Articulo.Vehiculo.modelo :
    //      (comprobante.DetalleVenta?.Articulo.Electrodomestico ?
    //        comprobante.DetalleVenta?.Articulo.Electrodomestico.modelo :
    //        'No hay marca disponible')) :
    //    'No hay marca disponible',


    //   dni: comprobante.DetalleVenta?.Venta?.Cliente.dni,
    //   fecha_venta: comprobante.DetalleVenta?.Venta?.fecha_venta || '',
    //   tipo_pago: comprobante.DetalleVenta?.Venta?.tipo_pago || '',
    //   cantidad: comprobante.DetalleVenta?.cantidad || '',
    //   precio_unitario: comprobante.DetalleVenta?.precio_unitario || '',
    //   subtotal: comprobante.DetalleVenta?.subtotal || '',
    //   total: comprobante.DetalleVenta?.Venta?.total || '',
    //   igv: comprobante.igv,
    //   descuento: comprobante.descuento,
    //   tipo_comprobante: comprobante.TipoComprobante?.nombre,
      
    //   serie: comprobante.num_serie
    // });
  }


}
