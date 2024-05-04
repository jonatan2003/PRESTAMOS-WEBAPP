import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Prestamo } from 'src/app/interfaces/prestamo.interface';
import { PrestamoService } from 'src/app/services/prestamo.service';

@Component({
  selector: 'app-reservation-search',
  templateUrl: './reservation-search.component.html',
  styleUrls: ['./reservation-search.component.css']
})
export class PrestamosSearchComponent {


  prestamos: Prestamo[] = []; // Array para almacenar los prestamos encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listPrestamos: Prestamo[] = []
  loading: boolean = false;


  

  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0


  constructor( private searchService: SearchService, 
    private _prestamosService: PrestamoService,
     private toastr: ToastrService,
     private impresionService: ImpresionService) {}

  deletePrestamo(id: number) {
    this.loading = true;
    this._prestamosService.deletePrestamo(id).subscribe(() => {
      
      this.toastr.warning('El Prestamo fue eliminado con exito', 'Prestamo eliminado');
    })
  }

// Método para realizar la búsqueda de prestamos
buscarPrestamos() {
  this.loading = true; // Establecer loading en true para mostrar la carga

this.searchService.searchPrestamos( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
  (response: any) => {
    this.prestamos = response.data; // Asignar los datos de empleados a la propiedad empleados
    this.currentPage = response.page; // Actualizar currentPage con el número de página actual
    this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
    this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
    this.loading = false; // Establecer loading en false al finalizar la carga
  },
  error => {
    console.error('Error al buscar empleado:', error);
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
    this.prestamos = []; // Limpiar la lista de prestamos
  }

  // Método para actualizar un cliente
  actualizarPrestamo(prestamos: Prestamo) {
    // Lógica para actualizar el prestamos
  }


}
