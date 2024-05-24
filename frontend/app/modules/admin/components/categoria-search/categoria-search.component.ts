import { Component } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';


@Component({
  selector: 'app-categoria-search',
  templateUrl: './categoria-search.component.html',
  styleUrls: ['./categoria-search.component.css']
})
export class CategoriaSearchComponent {

  categorias: Categoria[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listCategorias: Categoria[] = []
  loading: boolean = false;
  form: FormGroup;
  id: number;
  categoriaSeleccionado: Categoria | null = null;
  selectedCategoria: Categoria | null = null;

  
  // Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0

  constructor( private searchService: SearchService,
    private _categoriasService: CategoriaService,
    private _paginacionService: PaginacionService,
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
     private toastr: ToastrService,
    private impresionService: ImpresionService) {

      this.form = this.fb.group({
        nombre: ['', Validators.required],
  
        // ... Otros campos del formulario de categoria
      });
      this.id = Number(aRouter.snapshot.paramMap.get('id'));
  



    }


 
  // Método para realizar la búsqueda de  empleados
  buscarCategoria() {
    this.loading = true; // Establecer loading en true para mostrar la carga

  this.searchService.searchCategorias( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
    (response: any) => {
      this.categorias = response.data; // Asignar los datos de empleados a la propiedad empleados
      this.currentPage = response.page; // Actualizar currentPage con el número de página actual
      this.totalPages = response.totalPages; // Actualizar totalPages con el número total de páginas
      this.totalItems = response.totalItems; // Actualizar totalItems con el número total de elementos
      this.loading = false; // Establecer loading en false al finalizar la carga
    },
    error => {
      console.error('Error al buscar categoria:', error);
      this.loading = false; // Manejar el error y establecer loading en false
    }
  );
  }

  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.buscarCategoria();
  }



  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Método para eliminar la búsqueda
  eliminarBusqueda() {
    // Lógica para eliminar la búsqueda, si es necesario
    this.categorias = []; // Limpiar la lista de empleado
  }




  setSelectedCategoria(categoria: Categoria) {
    this.selectedCategoria = categoria;
  
   
      this.id = categoria.id;
      // Establecer los valores del cliente seleccionado en el formulario
      this.form.patchValue({
        nombre: categoria.nombre,
       
      });

      // Resetear el estado de validación del formulario y establecer formularioModificado a false
      this.form.markAsUntouched();
this.mostrarModal();
      console.log('Estado del formulario:', this.form.valid);
   
  }

  mostrarModal() {
    // Mostrar el modal
    const modal = document.getElementById('ModalCategoria');
    if (modal) {
      // Añadir las clases necesarias para mostrar el modal
      modal.classList.add('show');
      modal.classList.add('fade');
      modal.style.display = 'block';
  
      // Establecer el estado del modal como modal
      modal.setAttribute('aria-modal', 'true');
  
      // Agregar la clase 'modal-open' al cuerpo del documento
      document.body.classList.add('modal-open');
  
      // Crear y agregar el backdrop del modal
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop');
      backdrop.classList.add('fade');
      backdrop.classList.add('show');
      document.body.appendChild(backdrop);
    }
  }

  updateCategoria() {
    const categoria: Categoria = {
      nombre: this.form.value.nombre,
     
    };
  
    console.log('Empleado a actualizar:', categoria); // Agregar registro de cliente a actualizar
  
    if (this.id !== 0) {
      console.log('ID de la categoria a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar
  
      this.loading = true;
  
      categoria.id = this.id;
      this._categoriasService.updateCategoria(this.id, categoria).subscribe(() => {
        this.toastr.info(`La categoria ${categoria.nombre} fue actualizado con éxito`, 'categoria actualizada' ,
        {
          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
        
        this.loading = false;
        this.buscarCategoria();
  
        console.log('categoria actualizado con éxito'); // Registro de cliente actualizado con éxito
      }, error => {
        console.error('Error al actualizar la categoria:', error); // Manejo de errores
        this.toastr.error('Hubo un error al actualizar la categoria', 'Error');
        this.loading = false;
      });
    } else {
      console.log('ID del categoria no válido:', this.id); // Registro del ID de cliente no válido
      this.toastr.error('ID del categoria no válido', 'Error');
    }
  }


  guardar() {
    // Aquí iría tu lógica para guardar el formulario
    
    // Luego, cierra el modal
    const modal = document.getElementById('ModalCategoria');
    if (modal) {
      // Eliminar todas las clases de Bootstrap que controlan la visualización del modal
      modal.classList.remove('show');
      modal.classList.remove('fade');
      modal.classList.remove('show');
      modal.classList.remove('showing');
      
      // Ocultar el modal
      modal.style.display = 'none';
      
      // Restablecer el estado del modal
      modal.setAttribute('aria-modal', 'false');
      
      // Eliminar la clase 'modal-open' del cuerpo del documento
      document.body.classList.remove('modal-open');
      
      // Eliminar el backdrop del modal
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  }




  deleteCategoria(id: number) {
    // Mostrar confirmación antes de eliminar la categria
    Swal.fire({
      title: 'Eliminar Categoria',
      text: '¿Estás seguro de que deseas eliminar esta categoria?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeleteCategoria(id);
      }
    });
  }

  performDeleteCategoria(id: number) {
    this.loading = true;
    this._categoriasService.deleteCategoria(id).subscribe(() => {
      this.buscarCategoria();
      this.toastr.warning('La Categoria fue eliminado con exito', 'Categoria eliminado');
    })
  }


}