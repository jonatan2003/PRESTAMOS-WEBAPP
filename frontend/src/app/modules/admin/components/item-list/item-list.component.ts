import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
id: number;
  idelectrodomestico : number;
  idvehiculo : number;
  articuloSeleccionado: Articulo | null = null;
  selectedArticulo: Articulo | null = null;
   idarticulo : number
  categoriaSeleccionada: number = 0; // Variable para almacenar la categoría seleccionada
  listArticulos: Articulo[] = [];
  loading: boolean = false;
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


  constructor(private _articuloService: ArticulosService, 
    private _paginacionService: PaginacionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
     private impresionService: ImpresionService,
    private _electrodomesticoService: ElectrodomesticoService, private _vehiculoService: VehiculoService) { 


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

      this.id = Number(aRouter.snapshot.paramMap.get('id'));

    }

  ngOnInit(): void {

  }

  getListArticulos(categoriaSeleccionada: number) {
  this.loading = true;

  // Llama al servicio para obtener los artículos según la categoría seleccionada
  this._paginacionService.getListArticulos(this.currentPage, this.pageSize, categoriaSeleccionada)
    .subscribe(
      (response: any) => {
        //console.log(response.data);

        // Procesar los datos de acuerdo a la categoría seleccionada
        if (categoriaSeleccionada === 1) {
          // Filtrar y mapear los artículos que son vehículos
          this.listArticulosVehiculos = response.data.map((articulo: any) => ({
         
              id: articulo.id,
              estado: articulo.estado,
              observaciones: articulo.observaciones,
              Vehiculo: {
                
                id: articulo.idvehiculo,
                carroceria: articulo.Vehiculo?.carroceria || '',
                marca: articulo.Vehiculo?.marca || '',
                modelo: articulo.Vehiculo?.modelo || '',
                color: articulo.Vehiculo?.color || '',
                numero_serie: articulo.Vehiculo?.numero_serie || '',
                numero_motor: articulo.Vehiculo?.numero_motor || '',
                placa: articulo.Vehiculo?.placa || '',
                descripcion: articulo.Vehiculo?.descripcion || ''
              }
            }));
            console.log(this.listArticulosVehiculos);
        } else if (categoriaSeleccionada === 2) {
          // Filtrar y mapear los artículos que son electrodomésticos
          this.listArticulosElectrodomesticos = response.data.map((articulo: any) => ({
               id: articulo.id,
               estado: articulo.estado,
               observaciones: articulo.observaciones,
               Electrodomestico: {
                id: articulo.idelectrodomestico,
                descripcion: articulo.Electrodomestico?.descripcion || '',
                marca: articulo.Electrodomestico?.marca || '',
                modelo: articulo.Electrodomestico?.modelo || '',
                color: articulo.Electrodomestico?.color || '',
                numero_serie: articulo.Electrodomestico?.numero_serie || ''
              }
            }));
        }

        // Actualiza el número total de páginas según la respuesta recibida
        this.totalPages = response.totalPages;

        // Indica que la carga ha finalizado
        this.loading = false;
      },
      (error: any) => {
        console.error('Error al obtener los artículos:', error);
        this.loading = false;
        // Manejar el error de manera apropiada, por ejemplo, mostrando un mensaje al usuario
        // this.toastr.error('Error al obtener los artículos', 'Error');
      }
    );
}

  
  
  onCategoriaSelected(event: any) {
    const selectedCategoryId = Number(event.target.value);
    this.categoriaSeleccionada = selectedCategoryId;
    this.getListArticulos(this.categoriaSeleccionada); // Llamada para cargar artículos según la categoría seleccionada
  }
  
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListArticulos(this.categoriaSeleccionada);

  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }



 


  setSelectedArticulo(articulo: any) {
    this.selectedArticulo = articulo;
  
  
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

       
        this.getListArticulos(this.categoriaSeleccionada);

  
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
        this.getListArticulos(this.categoriaSeleccionada);


  
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
  
    this._articuloService.deleteArticulo(id).subscribe(
      () => {
        this.toastr.warning('El Articulo fue eliminado con éxito', 'Articulo eliminado');
        this.loading = false;
  
        // Actualiza localmente la lista de artículos eliminando el artículo eliminado
        this.listArticulos = this.listArticulos.filter(articulo => articulo.id !== id);
  
        // Verifica la categoría seleccionada
        if (this.categoriaSeleccionada === 1) {
          // Categoría de vehículos
          const vehiculoId = this.listArticulosVehiculos.find(articulo => articulo.id === id)?.Vehiculo.id;
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
        } else if (this.categoriaSeleccionada === 2) {
          // Categoría de electrodomésticos
          const electrodomesticoId = this.listArticulosElectrodomesticos.find(articulo => articulo.id === id)?.Electrodomestico.id;
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
  
        // Vuelve a cargar la lista de artículos según la categoría seleccionada
        this.getListArticulos(this.categoriaSeleccionada);
      },
      (error) => {
        console.error('Error al eliminar el Articulo:', error);
        this.toastr.error('Hubo un error al eliminar el Articulo', 'Error');
        this.loading = false;
      }
    );
  }



  // constructor(private impresionService: ImpresionService) { }

  onImprimir() {
    const entidad = 'Articulos'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Articulos'; // Título del informe
    this.impresionService.imprimir(entidad, encabezado, cuerpo, titulo, true); // Llama al servicio de impresión
  }

  // Método para obtener el encabezado de la tabla
  getEncabezado(): string[] {
    const encabezado: string[] = [];
    document.querySelectorAll('table thead th').forEach((th: HTMLTableHeaderCellElement) => {
      const texto = th.textContent.trim();
      if (texto !== 'ACTUALIZAR' && texto !== 'ELIMINAR' && texto !== 'IMPRIMIR') {
        encabezado.push(texto);
      }
    });
    return encabezado;
  }

  // Método para obtener el cuerpo de la tabla
  getCuerpo(): string[][] {
    const cuerpo: string[][] = [];
    document.querySelectorAll('table tbody tr').forEach((tr: HTMLTableRowElement) => {
      const fila: string[] = [];
      tr.querySelectorAll('td').forEach((td: HTMLTableCellElement) => {
        const texto = td.textContent.trim();
        if (texto !== 'Actualizar' && texto !== 'Eliminar' && texto !== 'Imprimir') {
          fila.push(texto);
        }
      });
      cuerpo.push(fila);
    });
    return cuerpo;
  }

 getPrestamosID(){
  this.loading = true;

  this._articuloService.deleteArticulo(this.id).subscribe(() => {


    this.toastr.warning('El Articulo fue eliminado con exito', 'Articulo eliminado');
    this.loading = false;
  });
  this.getListArticulos(this.categoriaSeleccionada);

 }



}
