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
import { Inventario } from 'src/app/interfaces/inventario.interface';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-inventario-search',
  templateUrl: './inventario-search.component.html',
  styleUrls: ['./inventario-search.component.css']
})
export class InventarioSearchComponent {

  articulos: Articulo[] = []; // Array para almacenar los clientes encontrados
  terminoBusqueda: string = ''; // Variable para almacenar el término de búsqueda
  listArticulos: Articulo[] = []
  loading: boolean = false;

  id: number;
  idelectrodomestico : number;
  idvehiculo : number;
  articuloSeleccionado: Articulo | null = null;
  selectedArticulo: Articulo | null = null;

  
  form: FormGroup;

  inventarioSeleccionado: Inventario | null = null;

  selectedInventario: Inventario | null = null;

  categoriaSeleccionada: number = 0; // Variable para almacenar la categoría seleccionada

  listInventarioArticulosVehiculos: Inventario[] = [];

  listInventarioArticulosElectrodomesticos: Inventario[] = [];

  listInventario: Inventario[] = []
 
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
    private _inventarioService: InventarioService, 
     private _articulosService: ArticulosService, 
     private toastr: ToastrService,
     private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
     private impresionService: ImpresionService,
    private _electrodomesticoService: ElectrodomesticoService, 
    private _vehiculoService: VehiculoService
     ) {


      this.form = this.fb.group({
        idarticulo: [{ value: '', disabled: true }, Validators.required],
        stock: [{ value: '', disabled: true }, Validators.required],
        estado_articulo: [{ value: '', disabled: true }, Validators.required],
        // valor_venta: ['', Validators.required],
        valor_venta: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9].*$")]],
        valor_precio: [{ value: '', disabled: true }, Validators.required],
      });
      this.id = Number(aRouter.snapshot.paramMap.get('id'));


     }


     onCategoriaSelected(event: any) {
      const selectedCategoryId = Number(event.target.value);
      this.categoriaSeleccionada = selectedCategoryId;
      this.buscarArticulos(); // Llamada para cargar artículos según la categoría seleccionada
    }


  getListArticulos() {
    this.loading = true;

    this._articulosService.getListArticulos().subscribe((data: Articulo[]) => {
      this.listArticulos = data;
      this.loading = false;
    })
  }

  buscarArticulos() {
    this.loading = true;
  
    if (!this.terminoBusqueda) {
      this.toastr.warning('INGRESAR DATOS DEL ARTÍCULO PARA BUSCAR', 'Advertencia', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
      this.loading = false;
      return;
    }
  
    this.searchService.searchInventario(this.currentPage, this.pageSize, this.terminoBusqueda).subscribe(
      (response: any) => {
        this.listInventario = [];
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.loading = false;
  
        this.listInventario = response.data.map((inventario: any) => {
          const articulo = inventario.Articulo;
          let mappedArticulo: Inventario | null = null;
  
          if (articulo) {
            if (articulo.idvehiculo !== null && articulo.idelectrodomestico === null) {
              this.categoriaSeleccionada = 1;
              mappedArticulo = this.mapArticulo(inventario, articulo, 'vehiculo');
            }else if (inventario.estado_articulo === "disponible") {
              this.categoriaSeleccionada = 3;
              mappedArticulo = this.mapArticulo(inventario, articulo, 'disponible');
            }
            else if (articulo.idelectrodomestico !== null && articulo.idvehiculo === null) {
              this.categoriaSeleccionada = 2;
              mappedArticulo = this.mapArticulo(inventario, articulo, 'electrodomestico');
            } 
          }
  
          return mappedArticulo!;
        }).filter((item: Inventario | null) => item !== null); // Filtrar valores nulos
  
        if (this.listInventario.length === 0) {
          this.toastr.warning('No se encontró el artículo especificado', 'Advertencia', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      },
      error => {
        console.error('Error al buscar artículos:', error);
        this.loading = false;
  
        this.toastr.error('Artículo no encontrado', 'Error', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    );
  }
  
  
  private mapArticulo(inventario: any, articulo: any, tipo: string): Inventario {
    if (tipo === 'vehiculo') {
      return {
        id: inventario.id,
        idarticulo: inventario.idarticulo,
        stock: inventario.stock,
        estado_articulo: inventario.estado_articulo,
        valor_venta: inventario.valor_venta,
        valor_precio: inventario.valor_precio,
        Articulo: {
          id: articulo.id,
          estado: articulo.estado,
          observaciones: articulo.observaciones,
          idcategoria: articulo.idcategoria,
          idelectrodomestico: undefined,
          idvehiculo: articulo.idvehiculo,
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
          },
          Electrodomestico: undefined
        }
      };
    } else if (tipo === 'electrodomestico') {
      return {
        id: inventario.id,
        idarticulo: inventario.idarticulo,
        stock: inventario.stock,
        estado_articulo: inventario.estado_articulo,
        valor_venta: inventario.valor_venta,
        valor_precio: inventario.valor_precio,
        Articulo: {
          id: articulo.id,
          estado: articulo.estado,
          observaciones: articulo.observaciones,
          idcategoria: articulo.idcategoria,
          idelectrodomestico: articulo.idelectrodomestico,
          idvehiculo: undefined,
          Vehiculo: undefined,
          Electrodomestico: {
            id: articulo.idelectrodomestico,
            descripcion: articulo.Electrodomestico?.descripcion || '',
            marca: articulo.Electrodomestico?.marca || '',
            modelo: articulo.Electrodomestico?.modelo || '',
            color: articulo.Electrodomestico?.color || '',
            numero_serie: articulo.Electrodomestico?.numero_serie || ''
          }
        }
      };
    } else if (tipo === 'disponible') {
      return {
        id: inventario.id,
        idarticulo: inventario.idarticulo,
        stock: inventario.stock,
        estado_articulo: inventario.estado_articulo,
        valor_venta: inventario.valor_venta,
        valor_precio: inventario.valor_precio,
        Articulo: {
          id: articulo.id,
          estado: articulo.estado,
          observaciones: articulo.observaciones,
          idcategoria: articulo.idcategoria,
          idelectrodomestico: articulo.idelectrodomestico,
          idvehiculo: articulo.idvehiculo,
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
          },
          Electrodomestico: {
            id: articulo.idelectrodomestico,
            descripcion: articulo.Electrodomestico?.descripcion || '',
            marca: articulo.Electrodomestico?.marca || '',
            modelo: articulo.Electrodomestico?.modelo || '',
            color: articulo.Electrodomestico?.color || '',
            numero_serie: articulo.Electrodomestico?.numero_serie || ''
          }
        }
      };
    }
    return null;
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
      this.listInventario = []; // Limpiar la lista de clientes
    }



    setSelectedInventario(inventario: Inventario) {
      if (inventario && inventario.id !== undefined) {
        this.selectedInventario = inventario;
        this.id = inventario.id;
    
        this.form.patchValue({
          idarticulo: inventario.Articulo?.Electrodomestico?.descripcion + ' '+ inventario.Articulo?.Electrodomestico?.modelo  + ' '+ inventario.Articulo?.Electrodomestico?.marca  
          || inventario.Articulo?.Vehiculo?.descripcion + ' '+ inventario.Articulo?.Vehiculo?.modelo    + ' '+ inventario.Articulo?.Vehiculo?.marca  , 
          stock: inventario.stock,
          estado_articulo: inventario.estado_articulo,
          valor_venta: inventario.valor_venta,
          valor_precio: inventario.valor_precio,
        });
    
        this.form.markAsUntouched();
        this.mostrarModal();
        console.log('Estado del formulario:', this.form.valid);
        console.log('Id inventario:', this.selectedInventario.id);
      } else {
        console.error('Inventario no válido o ID no definido:', inventario);
        this.toastr.error('Inventario no válido o ID no definido', 'Error');
      }
    }
    
    updateInventario() {
      const inventario: Inventario = {
        idarticulo: this.form.value.idarticulo,
        stock: this.form.value.stock,
        estado_articulo: this.form.value.estado_articulo,
        valor_venta: this.form.value.valor_venta,
        valor_precio: this.form.value.valor_precio,
        Articulo: this.selectedInventario?.Articulo // Use the existing Articulo if available
      };
    
      console.log('Inventario a actualizar:', inventario); // Agregar registro de inventario a actualizar
    
      if (this.id !== 0 && this.id !== undefined) {  // Verifica que el ID es válido
        console.log('ID del inventario a actualizar:', this.id); // Agregar registro del ID del inventario a actualizar
    
        this.loading = true;
    
        inventario.id = this.id;
        this._inventarioService.updateInventario(this.id, inventario).subscribe(() => {
          this.toastr.info(`El Inventario ${inventario.estado_articulo} fue actualizado con éxito`, 'Inventario actualizado', {
            timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
            progressBar: true, // Muestra la barra de progreso
            progressAnimation: 'increasing', // Animación de la barra de progreso
            positionClass: 'toast-top-right'
          }); // Posición del toastr en la pantalla
    
          this.loading = false;
          this.buscarArticulos();
    
          console.log('Inventario actualizado con éxito'); // Registro de inventario actualizado con éxito
        }, error => {
          console.error('Error al actualizar el Inventario:', error); // Manejo de errores
          this.toastr.error('Hubo un error al actualizar el Inventario', 'Error');
          this.loading = false;
        });
      } else {
        console.log('ID del Inventario no válido:', this.id); // Registro del ID de inventario no válido
        this.toastr.error('ID del Inventario no válido', 'Error');
      }
    }
    
    
    mostrarModal() {
      // Mostrar el modal
      const modal = document.getElementById('ModalInventario');
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
      const modal = document.getElementById('ModalInventario');
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
    
    
    deleteEmpleado(id: number) {
      // Mostrar confirmación antes de eliminar el empleado
      Swal.fire({
        title: 'Eliminar Empleado',
        text: '¿Estás seguro de que deseas eliminar este empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          // Confirmación aceptada, realizar eliminación
          this.performDeleteEmpleado(id);
        }
      });
    }
    
    performDeleteEmpleado(id: number) {
      this.loading = true;
      this._inventarioService.deleteInventario(id).subscribe(() => {
        this.buscarArticulos();
        this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
      })
    }
    
    
    
   
  
  onImprimir() {
    const entidad = 'Inventario'; // Nombre de la entidad (para el nombre del archivo PDF)
    const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
    const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
    const titulo = 'Lista de Inventario'; // Título del informe
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


    
    }
    