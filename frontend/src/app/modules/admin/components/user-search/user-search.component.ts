import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {


  usuarios: Usuario[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listUsuarios: Usuario[] = []
  loading: boolean = false;


  
  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0


  constructor( private searchService: SearchService, private _usuariosService: UsuarioService, private toastr: ToastrService,private impresionService: ImpresionService) {}


  getListUsuarios() {
    this.loading = true;

    this._usuariosService.getListUsuarios().subscribe((data: Usuario[]) => {
      this.listUsuarios = data;
      this.loading = false;
    })
  }


  deleteUsuario(id: number) {
    this.loading = true;
    this._usuariosService.deleteUsuario(id).subscribe(() => {
      this.getListUsuarios();
      this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
    })
  }



 // Método para realizar la búsqueda de prestamos
buscarUsuarios() {
  this.loading = true; // Establecer loading en true para mostrar la carga

this.searchService.searchUsuarios( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
  (response: any) => {
    this.usuarios = response.data; // Asignar los datos de empleados a la propiedad empleados
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
  this.buscarUsuarios();
}

// Método para generar las páginas disponibles
getPages(): number[] {
  // Retorna un array de números enteros del 1 al totalPages
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.usuarios = []; // Limpiar la lista de empleado
  }

  // Método para actualizar un empleado
  actualizarUsuario(usuario: Usuario) {
    // Lógica para actualizar el empleado
  }



}
