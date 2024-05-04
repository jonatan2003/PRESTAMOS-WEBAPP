import { Component,Injectable,OnInit } from '@angular/core';
import { Prestamo } from 'src/app/interfaces/prestamo.interface';
import { ToastrService } from 'ngx-toastr';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';



@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-prestamos-finished',
  templateUrl: './prestamos-finished.component.html',
  styleUrls: ['./prestamos-finished.component.css']
})
export class PrestamosFinishedComponent implements OnInit  {


  listPrestamos: Prestamo[] = [];

  loading: boolean = false;

  encabezado: string[] = [];
  cuerpo: string[][] = [];

  constructor(private _prestamosService: PrestamoService,
               private toastr: ToastrService,
               private impresionService: ImpresionService) { }




               ngOnInit(): void {
                this.getListPrestamos();
              }



              getListPrestamos() {
                this.loading = true;
                this._prestamosService.getPrestamosVencidos().subscribe((data: Prestamo[]) => {
                  this.listPrestamos = data;
                  this.loading = false;
                });
              }





  deletePrestamo(id: number) {
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
    const prestamo = this.listPrestamos[index];
    this.impresionService.imprimirFilaPrestamos('Prestamos', {
      cliente: prestamo.Cliente?.nombre || '',
      dni: prestamo.Cliente?.dni || '',
      empleado: prestamo.Empleado?.nombre || '',
      articulo: prestamo.Articulo ? (prestamo.Articulo.Vehiculo ? prestamo.Articulo.Vehiculo.descripcion : (prestamo.Articulo.Electrodomestico ? prestamo.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
      fechaPrestamo: prestamo.fecha_prestamo || '',
      fechaDevolucion: prestamo.fecha_devolucion || '',
      montoPrestamo: prestamo.monto_prestamo || '',
      montoPago: prestamo.monto_pago || '',
      observaciones: prestamo.observacion || ''
    } );
  }




}
