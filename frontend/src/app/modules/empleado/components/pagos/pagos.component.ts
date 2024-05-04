import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pago } from 'src/app/interfaces/pago.interface';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { PagosService } from 'src/app/services/pago.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent {


  listPago: Pago[] = []
  loading: boolean = false;

// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0
  

  constructor(private _pagoService: PagosService, private toastr: ToastrService,private _paginacionService: PaginacionService ) { }

  ngOnInit(): void {
    this.getListPagos();
  }

  getListPagos() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._paginacionService.getListPagos(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listPago = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
      this.totalPages = response.totalPages;
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
    this._pagoService.deletePago(id).subscribe(() => {
      this.getListPagos();
      this.toastr.warning('El Pago fue eliminado con exito', 'Pago eliminado');
    })
    this.getListPagos();
  }









}
