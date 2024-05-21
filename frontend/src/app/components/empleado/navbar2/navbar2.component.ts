import { Component, OnInit, OnDestroy ,ChangeDetectorRef,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Prestamo } from 'src/app/interfaces/prestamo.interface';
import { ToastrService } from 'ngx-toastr';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { RequestService } from 'src/app/services/request.service';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit, OnDestroy {
  nombreUsuario: string | null;
  message: string = '';
  eventSubscription: Subscription;
  showNotifications: boolean = false;

  listPrestamos: Prestamo[] = [];

  loading: boolean = false;

  encabezado: string[] = [];
  cuerpo: string[][] = [];


  currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0; 

  constructor(private _prestamosService: PrestamoService,
    private toastr: ToastrService,
    private impresionService: ImpresionService,
    private requestService: RequestService,
    private websocketService: WebSocketService,
    private _paginacionService : PaginacionService,
    private cd: ChangeDetectorRef, private router: Router) {
    this.nombreUsuario = localStorage.getItem('usuario');
  }




  ngOnInit() {
    this.getListPrestamos();
    // this.websocketService.listen('prestamosUpdated').subscribe((data: any) => {
    //   this.message = data.message;
    //   // Aquí puedes ejecutar lógica adicional para manejar la actualización de préstamos
    // });

    this.eventSubscription = this.websocketService.listen('prestamoActualizado').subscribe((data: any) => {
      console.log('Evento recibido:', data); // Verificar que el evento se recibe
      this.handlePrestamoActualizado(data);
    });
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  private handlePrestamoActualizado(data: any) {
    const { message, prestamo } = data;
    const { estado, cliente, empleado } = prestamo;

    this.toastr.info(
      `${message} '${estado}': Cliente - ${cliente}, Empleado - ${empleado}`,
      'Préstamo Vencido',
      {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true,
        tapToDismiss: true,
        onActivateTick: true
      }
    );

    this.getListPrestamos();
  }
  
  getListPrestamos() {
    this.loading = true;

    // Llamar al servicio de paginación para obtener la lista de préstamos
    this._paginacionService.getListPrestamosVentas(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.listPrestamos = response.data; // Asignar los datos de préstamos del objeto devuelto por el servicio
        this.loading = false;

        // Calcular totalPages basado en el total de ítems y el tamaño de la página
        this.totalPages = Math.ceil(response.totalItems / this.pageSize);

        // Forzar la detección de cambios para actualizar la vista
        this.cd.detectChanges();
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener la lista de préstamos:', error);
      }
    );
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListPrestamos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  confirmLogout() {
    // localStorage.removeItem('token');
    // localStorage.removeItem('usuario');
    // this.nombreUsuario = null;
    // this.cd.detectChanges();
    // this.router.navigate(['/login']);

    console.log('Confirm logout called');
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performLogout();
      }
    });
  }

  performLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.nombreUsuario = null;
    this.cd.detectChanges();
    this.router.navigate(['/login']);
  }




  deletePrestamo(id: number) {
    this.loading = true;
    this._prestamosService.deletePrestamo(id).subscribe(() => {
      this.getListPrestamos();
      this.toastr.warning('El Prestamo fue eliminado con exito', 'Prestamo eliminado');
    })
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
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
      // empleado: prestamo.Empleado?.nombre || '',
      articulo: prestamo.Articulo ? (prestamo.Articulo.Vehiculo ? prestamo.Articulo.Vehiculo.descripcion : (prestamo.Articulo.Electrodomestico ? prestamo.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
      fechaPrestamo: prestamo.fecha_prestamo || '',
      fechaDevolucion: prestamo.fecha_devolucion || '',
      montoPrestamo: prestamo.monto_prestamo || '',
      montoPago: prestamo.monto_pago || '',
      observaciones: prestamo.Articulo?.observaciones || ''
    } );
  }



}





