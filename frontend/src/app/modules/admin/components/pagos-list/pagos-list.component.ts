import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pago } from 'src/app/interfaces/pago.interface';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { PagosService } from 'src/app/services/pago.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { CronogramaPagosService } from 'src/app/services/cronograma_pagos.service';
import { CronogramaPago } from 'src/app/interfaces/cronograma_pagos.interface';

@Component({
  selector: 'app-pagos-list',
  templateUrl: './pagos-list.component.html'
  
})
export class PagosListComponent {


  listPago: Pago[] = []
  loading: boolean = false;
  listTickets: Ticket [] = []
// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0
  
listCronogramaPago: CronogramaPago[] = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
   private aRouter: ActivatedRoute,
    private impresionService: ImpresionService,
    private _pagosService: PagosService ,
    private _paginacionService: PaginacionService ,
    private _CronogramaPagos: CronogramaPagosService,

  ) { }

  ngOnInit(): void {
    this.getListPagos();
    this.verPagos();
  }

  getListPagos() {
    this.loading = true;
  
    this._paginacionService.getListTickets(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        // Filtrar los tickets para mostrar solo aquellos que tienen un pago
        this.listTickets = response.data.filter(ticket => ticket.Pago);
  
        this.loading = false;
  
        // Utiliza totalItems del objeto de respuesta para calcular totalPages
        this.totalPages = response.totalPages;
      },
      error => {
        console.error('Error al cargar los tickets:', error);
        this.toastr.error('Hubo un error al cargar los tickets', 'Error');
        this.loading = false;
      }
    );
  
  }

  verPagos() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._pagosService.getListPagos().subscribe((response: any) => {
      this.listPago = response; // Asigna los datos de clientes del objeto devuelto por el servicio
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
    });
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListPagos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

 
  
  deletePago(id: number) {

    Swal.fire({
      title: 'Eliminar Pago',
      text: '¿Estás seguro de que deseas eliminar este Pago?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeletePago(id);
      }
    });
  }

  performDeletePago(id: number) {
    this.loading = true;
    this._pagosService.deletePago(id).subscribe(() => {
      this.getListPagos();
      this.toastr.warning('El Pago fue eliminado con exito', 'Pago eliminado');
    })
    this.getListPagos();
  }

  getCronogramaPagos(idPrestamo: number, callback: (cronograma: CronogramaPago[]) => void) {
    this.loading = true;
    
    this._CronogramaPagos.getCronogramaPagosByIdPrestamo(idPrestamo).subscribe((response: CronogramaPago[]) => {
      const cronograma = response.slice(0, 3); // Obtener solo los dos primeros registros
      this.loading = false;
      console.log(cronograma);
      callback(cronograma); // Llamar al callback con los datos del cronograma
    });
  }
  
 
  onImprimir() {
    const entidad = 'Pagos'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Pagos'; // Título del informe
    
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
        'PRESTAMO',
        'ARTICULO',
        'TIPO PAGO',
        'FECHA DE PAGO',
        'INTERES PAGO',
        'MONTO RESTANTE',
        'CAPITAL PAGO'
  
      ];
    
      return encabezado;
    }
  
  
    getCuerpo(): any[][] {
      const cuerpo: any[][] = [];
      const textosExcluidos = new Set(['Actualizar', 'Eliminar', 'Imprimir']); // Textos a excluir
      const filasVistas = new Set(); // Usar un conjunto para mantener un registro de las filas ya vistas
      
      this.listTickets.forEach((ticket) => {
        const fila: any[] = [
          ticket.Prestamo?.Cliente.nombre + ' ' + ticket.Prestamo?.Cliente.apellido,
         // ticket.Empleado?.nombre + ' ' + ticket.Empleado?.apellidos,
           ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.descripcion :
             (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.descripcion : 
              'No hay descripción disponible')) : 'No hay descripción disponible',
              ticket.Pago.TipoPago?.nombre_tipo,
             ticket.Pago?.fecha_pago,
          ticket.Pago?.interes_pago,
         ticket.Pago?.monto_restante,
          ticket.Pago?.capital_pago,
          
        ];
    
        // Convertir la fila en una cadena para compararla
        const filaString = fila.join('|');
    
        // Solo agregar la fila al cuerpo si no se ha visto antes
        if (!filasVistas.has(filaString)) {
          cuerpo.push(fila);
          filasVistas.add(filaString);
        }
      });
    
      return cuerpo;
    }




    onImprimirFila(index: number) {
      const ticket = this.listTickets[index];
      const idPrestamo = ticket.Prestamo?.id;
      if (idPrestamo) {
        this.getCronogramaPagos(idPrestamo, (cronograma) => {
          const detallesCronograma = cronograma.map(( item) => ({
            fechaPago: this.formatDate(item.fecha_pago),
            montoPagado:item.monto_pagado,
          }));

      this.impresionService.imprimirFilaPagos('Pagos', {
        cliente:ticket.Prestamo.Cliente?.nombre+" "+ticket.Prestamo.Cliente?.apellido,
        dni: ticket.Prestamo.Cliente?.dni || '',
        empleado:ticket.Empleado?.nombre +" " + ticket.Empleado?.apellidos || '',
        articulo: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.descripcion : 
           (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.descripcion 
            : 'No hay descripción disponible')) : 'No hay descripción disponible',
            
        marca:ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.marca : 
          (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.marca :
             'No hay marca disponible')) : 'No hay marca disponible',
  
         modelo: ticket.Prestamo?.Articulo ? (ticket.Prestamo?.Articulo.Vehiculo ? ticket.Prestamo?.Articulo.Vehiculo.modelo : 
          (ticket.Prestamo?.Articulo.Electrodomestico ? ticket.Prestamo?.Articulo.Electrodomestico.modelo :
             'No hay modelo disponible')) : 'No hay modelo disponible',
        


             fechaPrestamo: this.formatDate(ticket.Prestamo?.fecha_prestamo) || '',
             fechaDevolucion: this.formatDate(ticket.Prestamo?.fecha_devolucion) || '',

        tipo_pago: ticket.Pago?.TipoPago?.nombre_tipo || '',
        fecha_pago: ticket.Pago?.fecha_pago || '',
        interes_pago: ticket.Pago?.interes_pago || '',
        monto_restante: ticket.Pago?.monto_restante || '',
        capital_pago: ticket.Pago?.capital_pago || '',
        num_serie: ticket.num_serie,
        num_ticket: ticket.num_ticket,

        cronogramaPagos: detallesCronograma
      } );
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
