import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injectable } from '@angular/core';
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
import { Ticket } from 'src/app/interfaces/ticket.interface';

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

// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página

totalItems: number;
totalPages: number = 0; 

listTickets: Ticket[] = [];

  constructor(private _prestamosService: PrestamoService,
    private toastr: ToastrService,
    private impresionService: ImpresionService,
    private requestService: RequestService,
    private websocketService: WebSocketService,
    private _paginacionService: PaginacionService,
    private cd: ChangeDetectorRef, private router: Router) {
    this.nombreUsuario = localStorage.getItem('usuario');
  }

  ngOnInit() {
    this.getListPrestamos();

    this.eventSubscription = this.websocketService.listen('prestamoActualizado').subscribe((data: any) => {
      console.log('Evento recibido:', data); // Verificar que el evento se recibe
      this.handlePrestamoActualizado(data);
    });
  }

  getListPrestamos() {
    this.loading = true;
  
    this._paginacionService.getListPrestamosVencidos(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listTickets = response.data;
      this.loading = false;
      this.totalPages = response.totalPages;
    });
  }
  
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListPrestamos();
  }
  
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
      `${message} '${estado}': Cliente - ${cliente}`,
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

  confirmLogout() {
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

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
