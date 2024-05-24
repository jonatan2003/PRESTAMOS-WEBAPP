import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Pago } from 'src/app/interfaces/pago.interface';
import { PagosService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-pagos2-search',
  templateUrl: './pagos2-search.component.html',
  styleUrls: ['./pagos2-search.component.css']
})
export class Pagos2SearchComponent  {

  pagos: Pago[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listPagos: Pago[] = []
  loading: boolean = false;

  // Define propiedades para la paginación
  currentPage: number = 1;
  pageSize: number = 10; // Tamaño de la página
  totalItems: number;
  totalPages: number = 0;   // Inicializa totalPages en 0
  


  constructor( private searchService: SearchService,
     private _PagosService: PagosService, private toastr: ToastrService,
     private impresionService: ImpresionService) {}


  getListPagos() {
    this.loading = true;

    this._PagosService.getListPagos().subscribe((data: Pago[]) => {
      this.listPagos = data;
      this.loading = false;
    })
  }

  deletePago(id: number) {
    this.loading = true;
    this._PagosService.deletePago(id).subscribe(() => {
      this.getListPagos();
      this.toastr.warning('El Articulo fue eliminado con exito', 'Articulo eliminado');
    })
  }


   // Método para realizar la búsqueda de clientes
   buscarPagos() {
    this.loading = true; // Establecer loading en true para mostrar la carga

  this.searchService.searchPagos( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
    (response: any) => {
      this.pagos = response.data; // Asignar los datos de empleados a la propiedad empleados
      this.currentPage = response.page; // Actualizar currentPage con el número de página actual
      this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
      this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
      this.loading = false; // Establecer loading en false al finalizar la carga
    },
    error => {
      console.error('Error al buscar articulos:', error);
      this.loading = false; // Manejar el error y establecer loading en false
    }
  );
  }

  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.buscarPagos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


    // Método para eliminar la búsqueda
    eliminarBusqueda() {
      // Lógica para eliminar la búsqueda, si es necesario
      this.pagos = []; // Limpiar la lista de clientes
    }

    // Método para actualizar un cliente
    actualizarPago(pago: Pago) {
      // Lógica para actualizar el cliente
    }

}
