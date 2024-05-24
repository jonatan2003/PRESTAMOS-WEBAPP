import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { ArticulosService } from 'src/app/services/articulo.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ElectrodomesticoService } from 'src/app/services/electrodomestico.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Electrodomestico } from 'src/app/interfaces/electrodomestico.interface';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { PaginacionService } from 'src/app/services/paginacion.service';


@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent {

  articulos: Articulo[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listArticulos: Articulo[] = []
  loading: boolean = false;

  id: number;
  idelectrodomestico : number;
  idvehiculo : number;
  articuloSeleccionado: Articulo | null = null;
  selectedArticulo: Articulo | null = null;

  
  categoriaSeleccionada: number = 0; // Variable para almacenar la categoría seleccionada
  listCategorias: Categoria[] = [];
  listArticulosVehiculos: Articulo[] = [];
  listArticulosElectrodomesticos: Articulo[] = [];
  loadingVehiculos: boolean = false;
  loadingElectrodomesticos: boolean = false;
  formVehiculo: FormGroup;
  formElectrodomestico: FormGroup;

  // Define propiedades para la paginación
  currentPage: number = 1;
  pageSize: number = 10; // Tamaño de la página
  totalItems: number;
  totalPages: number = 0;   // Inicializa totalPages en 0
  


  constructor( private searchService: SearchService,
     private _articulosService: ArticulosService, 
     private toastr: ToastrService,
     private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
     private impresionService: ImpresionService,
    private _electrodomesticoService: ElectrodomesticoService, 
    private _vehiculoService: VehiculoService
     ) {



      this.formVehiculo = this.fb.group({
        carroceria: ['', Validators.required],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        color: ['', Validators.required],
        numero_serie: ['', Validators.required],
        numero_motor: ['', Validators.required],
        placa: ['', Validators.required],
        descripcion: ['', Validators.required],
      });

      this.formElectrodomestico = this.fb.group({
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        color: ['', Validators.required],
        numero_serie: ['', Validators.required],
        descripcion: ['', Validators.required],
      });




     }


  getListArticulos() {
    this.loading = true;

    this._articulosService.getListArticulos().subscribe((data: Articulo[]) => {
      this.listArticulos = data;
      this.loading = false;
    })
  }


   // Método para realizar la búsqueda de clientes
   buscarArticulos() {
    this.loading = true; // Establecer loading en true para mostrar la carga

  this.searchService.searchArticulos( this.currentPage, this.pageSize,this.terminoBusqueda,).subscribe(
    (response: any) => {
      this.articulos = response.data; // Asignar los datos de empleados a la propiedad empleados
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
    this.buscarArticulos();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


    // Método para eliminar la búsqueda
    eliminarBusqueda() {
      // Lógica para eliminar la búsqueda, si es necesario
      this.articulos = []; // Limpiar la lista de clientes
    }




    setSelectedArticulo(articulo: any) {
      this.selectedArticulo = articulo;
    this.categoriaSeleccionada = articulo.Categoria.id;
    
      if (this.categoriaSeleccionada === 1 ) {
        this.idvehiculo = articulo.Vehiculo.id;
    
       
          this.formVehiculo.patchValue({
            carroceria: articulo.Vehiculo.carroceria,
            marca: articulo.Vehiculo.marca,
            modelo: articulo.Vehiculo.modelo,
            color: articulo.Vehiculo.color,
            numero_serie: articulo.Vehiculo.numero_serie,
            numero_motor: articulo.Vehiculo.numero_motor,
            placa: articulo.Vehiculo.placa,
            descripcion: articulo.Vehiculo.descripcion,
          });
    
          this.formVehiculo.markAsUntouched();
          this.mostrarModal();
    
          console.log('Estado del formulario:', this.formVehiculo.valid);
        
      } else if (this.categoriaSeleccionada === 2 ) {
        this.idelectrodomestico = articulo.Electrodomestico.id;
          this.formElectrodomestico.patchValue({
            marca: articulo.Electrodomestico.marca,
            modelo: articulo.Electrodomestico.modelo,
            color: articulo.Electrodomestico.color,
            numero_serie: articulo.Electrodomestico.numero_serie,
            descripcion: articulo.Electrodomestico.descripcion,
          });
    
          this.formElectrodomestico.markAsUntouched();
          this.mostrarModal();
    
          console.log('Estado del formulario:', this.formElectrodomestico.valid);
        
      }
    }
    // updateArticulo(){
  
    // }
   
  
    updateElectrodomestico() {
      const electrodomestico: Electrodomestico = {
       
        marca: this.formElectrodomestico.value.nombre,
          modelo:  this.formElectrodomestico.value.modelo,
          color: this.formElectrodomestico.value.color,
          numero_serie:  this.formElectrodomestico.value.numero_serie,
          descripcion:  this.formElectrodomestico.value.descripcion,
      };
    
    
      if (this.idelectrodomestico !== 0) {
    
        this.loading = true;
    
        electrodomestico.id = this.idelectrodomestico;
        this._electrodomesticoService.updateElectrodomestico(this.idelectrodomestico, electrodomestico).subscribe(() => {
          this.toastr.info(`El Articulo ${electrodomestico.descripcion} fue actualizado con éxito`, 'Articulo actualizado' ,
          {
            timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
            progressBar: true, // Muestra la barra de progreso
            progressAnimation: 'increasing', // Animación de la barra de progreso
            positionClass: 'toast-top-right'
            }); // Posición del toastr en la pantalla
          
          this.loading = false;
          this.guardar();
  
         
          this.buscarArticulos();
  
    
          console.log('Articulo actualizado con éxito'); // Registro de cliente actualizado con éxito
        }, error => {
          console.error('Error al actualizar el Articulo:', error); // Manejo de errores
          this.toastr.error('Hubo un error al actualizar el Articulo', 'Error');
          this.loading = false;
        });
      } else {
        console.log('Actualizacion del articulo no válido:',); // Registro del ID de cliente no válido
        this.toastr.error('ID del articulo no válido', 'Error');
      }
    }
  
  
    updateVehiculo() {
      const vehiculo: Vehiculo = {
       
    
        carroceria:  this.formVehiculo.value.carroceria,
        marca:  this.formVehiculo.value.marca,
        modelo: this.formVehiculo.value.modelo,
        color:  this.formVehiculo.value.color,
        numero_serie:  this.formVehiculo.value.numero_serie,
        numero_motor:  this.formVehiculo.value.numero_motor,
        placa:  this.formVehiculo.value.placa,
        descripcion:  this.formVehiculo.value.descripcion,
      };
    
    
      if (this.idvehiculo !== 0) {
    
        this.loading = true;
    
        vehiculo.id = this.idvehiculo;
        this._vehiculoService.updateVehiculo(this.idvehiculo, vehiculo).subscribe(() => {
          this.toastr.info(`El Articulo ${vehiculo.descripcion} fue actualizado con éxito`, 'Articulo actualizado' ,
          {
            timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
            progressBar: true, // Muestra la barra de progreso
            progressAnimation: 'increasing', // Animación de la barra de progreso
            positionClass: 'toast-top-right'
            }); // Posición del toastr en la pantalla
          
          this.loading = false;
          this.guardar();
          this.buscarArticulos();
  
  
    
          console.log('Articulo actualizado con éxito'); // Registro de cliente actualizado con éxito
        }, error => {
          console.error('Error al actualizar el Articulo:', error); // Manejo de errores
          this.toastr.error('Hubo un error al actualizar el Articulo', 'Error');
          this.loading = false;
        });
      } else {
        console.log('Actualizacion del articulo no válido:'); // Registro del ID de cliente no válido
        this.toastr.error('ID del articulo no válido', 'Error');
      }
    }
  
    mostrarModal() {
      // Mostrar el modal
      const modal = document.getElementById('ModalArticulo');
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
  
     guardar() {
      // Aquí iría tu lógica para guardar el formulario
      
      // Luego, cierra el modal
      const modal = document.getElementById('ModalArticulo');
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
  
  
  
    deleteArticulo(id: number) {
      console.log(this.id);
  
      Swal.fire({
        title: 'Eliminar Articulo',
        text: '¿Estás seguro de que deseas eliminar este Articulo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          // Confirmación aceptada, realizar eliminación
          this.performDeleteArticulo(id);
        }
      });
    }
    performDeleteArticulo(id: number) {
      this.loading = true;
    
      this._articulosService.deleteArticulo(id).subscribe(
        () => {
          this.toastr.warning('El Articulo fue eliminado con éxito', 'Articulo eliminado');
          this.loading = false;
    
          // Actualiza localmente la lista de artículos eliminando el artículo eliminado
          this.listArticulos = this.listArticulos.filter(articulo => articulo.id !== id);
    
          // Obtener el artículo eliminado para determinar la categoría
          const articuloEliminado = this.articulos.find(articulo => articulo.id === id);
          if (articuloEliminado) {
            // Verificar la categoría del artículo eliminado
            const categoriaId = articuloEliminado.Categoria.id;
    
            if (categoriaId === 1) {
              // Categoría de vehículos
              const vehiculoId = articuloEliminado.Vehiculo.id;
              if (vehiculoId) {
                // Elimina el vehículo asociado
                this._vehiculoService.deleteVehiculo(vehiculoId).subscribe(
                  () => {
                    console.log('Vehículo asociado eliminado con éxito');
                  },
                  error => {
                    console.error('Error al eliminar el vehículo asociado:', error);
                    this.toastr.error('Hubo un error al eliminar el vehículo asociado', 'Error');
                  }
                );
              }
            } else if (categoriaId === 2) {
              // Categoría de electrodomésticos
              const electrodomesticoId = articuloEliminado.Electrodomestico.id;
              if (electrodomesticoId) {
                // Elimina el electrodoméstico asociado
                this._electrodomesticoService.deleteElectrodomestico(electrodomesticoId).subscribe(
                  () => {
                    console.log('Electrodoméstico asociado eliminado con éxito');
                  },
                  error => {
                    console.error('Error al eliminar el electrodoméstico asociado:', error);
                    this.toastr.error('Hubo un error al eliminar el electrodoméstico asociado', 'Error');
                  }
                );
              }
            }
          }
    
          // Vuelve a cargar la lista de artículos después de la eliminación
          this.buscarArticulos();
        },
        (error) => {
          console.error('Error al eliminar el Articulo:', error);
          this.toastr.error('Hubo un error al eliminar el Articulo', 'Error');
          this.loading = false;
        }
      );
    }
    


}
