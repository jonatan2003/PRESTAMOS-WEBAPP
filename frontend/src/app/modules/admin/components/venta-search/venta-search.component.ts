import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-venta-search',
  templateUrl: './venta-search.component.html',
  styleUrls: ['./venta-search.component.css']
})
export class VentaSearchComponent {


  ventas: Venta[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listVentas: Venta[] = []
  loading: boolean = false;


  
  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor( private searchService: SearchService,
     private _ventasService: VentaService, private toastr: ToastrService,
     private impresionService: ImpresionService) {}


 


  deleteVenta(id: number) {
    this.loading = true;
    this._ventasService.deleteVenta(id).subscribe(() => {
      this.buscarVentas();
      this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
    })
  }



  // Método para realizar la búsqueda de  empleados
  
  // Método para realizar la búsqueda de  empleados
  buscarVentas() {
    this.loading = true; // Establecer loading en true para mostrar la carga

  this.searchService.searchEmpleados( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
    (response: any) => {
      this.ventas = response.data; // Asignar los datos de empleados a la propiedad empleados
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
    this.ventas = []; // Limpiar la lista de empleado
  }

  // Método para actualizar un empleado
  actualizarVentas(venta: Venta) {
    // Lógica para actualizar el empleado
  }



}

