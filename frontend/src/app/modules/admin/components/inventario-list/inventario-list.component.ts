import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { Inventario } from 'src/app/interfaces/inventario.interface';
import { InventarioService } from 'src/app/services/inventario.service';
import { Articulo } from 'src/app/interfaces/articulo.interface';

@Component({
  selector: 'app-inventario-list',
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.css']
})
export class InventarioListComponent {

  form: FormGroup;
  id: number;
  inventarioSeleccionado: Inventario | null = null;
  selectedInventario: Inventario | null = null;
  categoriaSeleccionada: number = 0; // Variable para almacenar la categoría seleccionada
  listArticulosVehiculos: Articulo[] = [];
  listArticulosElectrodomesticos: Articulo[] = [];

  listInventario: Inventario[] = []
  loading: boolean = false;

// Define propiedades para la paginación
currentPage: number = 1;
pageSize: number = 10; // Tamaño de la página
totalItems: number;
totalPages: number = 0;   // Inicializa totalPages en 0


constructor(private _inventarioService: InventarioService, 
  private _paginacionService: PaginacionService,
  private toastr: ToastrService,
  private fb: FormBuilder,
  private router: Router,
  private aRouter: ActivatedRoute,
  private impresionService: ImpresionService,
  ) { 

  this.form = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
    fecha_nacimiento: ['', Validators.required],
    fecha_contratacion: ['', Validators.required],
    genero: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
    correo: ['', [Validators.required, Validators.email]],
    tipo_contrato: ['', Validators.required],
    // ... Otros campos del formulario de empleado
  });
  this.id = Number(aRouter.snapshot.paramMap.get('id'));
}

ngOnInit(): void {
  this.getListInventario();
}

onCategoriaSelected(event: any) {
  const selectedCategoryId = Number(event.target.value);
  this.categoriaSeleccionada = selectedCategoryId;
  this.getListInventario(); // Llamada para cargar artículos según la categoría seleccionada
}


getListInventario() {
  this.loading = true;

  // Ajustar el método para aceptar parámetros de paginación
  this._paginacionService.getListInventario(this.currentPage, this.pageSize).subscribe(
    (response: any) => {
      // Inicializar las listas
      this.listArticulosVehiculos = [];
      this.listArticulosElectrodomesticos = [];

      // Procesar los datos de acuerdo a la categoría seleccionada
      response.data.forEach((inventario: any) => {
        const articulo = inventario.Articulo;
        if (articulo) {
          if (articulo.idcategoria === 1) {
            // Filtrar y mapear los artículos que son vehículos
            this.listInventario.push({
              id: inventario.id,
              stock: inventario.stock,
              estado_articulo: inventario.estado_articulo,
              valor_venta: inventario.valor_venta,
              valor_precio: inventario.valor_precio,
              estado: articulo.estado,
              observaciones: articulo.observaciones,
              ...articulo.Vehiculo
            });
          } else if (articulo.idcategoria === 2) {
            // Filtrar y mapear los artículos que son electrodomésticos
            this.listInventario.push({
              id: inventario.id,
              stock: inventario.stock,
              estado_articulo: inventario.estado_articulo,
              valor_venta: inventario.valor_venta,
              valor_precio: inventario.valor_precio,
              estado: articulo.estado,
              observaciones: articulo.observaciones,
              ...articulo.Electrodomestico
            });
          }
        }
      });

      console.log('Artículos Vehículos:', this.listArticulosVehiculos);
      console.log('Artículos Electrodomésticos:', this.listArticulosElectrodomesticos);

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

// Método para cambiar de página
pageChanged(page: number) {
  this.currentPage = page;
  this.getListInventario();
}

// Método para generar las páginas disponibles
getPages(): number[] {
  // Retorna un array de números enteros del 1 al totalPages
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}


setSelectedInventario(inventario: Inventario) {
  this.selectedInventario = inventario;

 
    this.id = inventario.id;
    // Establecer los valores del cliente seleccionado en el formulario
    this.form.patchValue({
       idarticulo: 0,
    stock: 0,
     estado_articulo: "",
     valor_venta: 0,
     valor_precio: 0
    });

    // Resetear el estado de validación del formulario
    this.form.markAsUntouched();
    this.mostrarModal();
    console.log('Estado del formulario:', this.form.valid);
 
}

updateEmpleado() {
  const inventario: Inventario = {
    idarticulo: 0,
    stock: 0,
     estado_articulo: "",
     valor_venta: 0,
     valor_precio: 0
  };

  console.log('Inventario a actualizar:', inventario); // Agregar registro de cliente a actualizar

  if (this.id !== 0) {
    console.log('ID del inventario a actualizar:', this.id); // Agregar registro del ID del cliente a actualizar

    this.loading = true;

    inventario.id = this.id;
    this._inventarioService.updateInventario(this.id, inventario).subscribe(() => {
      this.toastr.info(`El Inventario fue actualizado con éxito`, 'Inventario actualizado' ,
      {
        timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
        progressBar: true, // Muestra la barra de progreso
        progressAnimation: 'increasing', // Animación de la barra de progreso
        positionClass: 'toast-top-right'
        }); // Posición del toastr en la pantalla
      
      this.loading = false;
      this.getListInventario();

      console.log('empleado actualizado con éxito'); // Registro de cliente actualizado con éxito
    }, error => {
      console.error('Error al actualizar el empleado:', error); // Manejo de errores
      this.toastr.error('Hubo un error al actualizar el empleado', 'Error');
      this.loading = false;
    });
  } else {
    console.log('ID del empleado no válido:', this.id); // Registro del ID de cliente no válido
    this.toastr.error('ID del empleado no válido', 'Error');
  }
}


mostrarModal() {
  // Mostrar el modal
  const modal = document.getElementById('ModalEmpleado');
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
  const modal = document.getElementById('ModalEmpleado');
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
    this.getListInventario();
    this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
  })
}


// constructor(private impresionService: ImpresionService) { }

onImprimir() {
  const entidad = 'Empleados'; // Nombre de la entidad (para el nombre del archivo PDF)
  const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
  const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
  const titulo = 'Lista de Empleados'; // Título del informe
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