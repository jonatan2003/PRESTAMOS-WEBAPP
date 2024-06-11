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

  listInventarioArticulosVehiculos: Inventario[] = [];

  listInventarioArticulosElectrodomesticos: Inventario[] = [];

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
    idarticulo: [{ value: '', disabled: true }, Validators.required],
    stock: [{ value: '', disabled: true }, Validators.required],
    estado_articulo: [{ value: '', disabled: true }, Validators.required],
    // valor_venta: ['', Validators.required],
    valor_venta: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9].*$")]],
    valor_precio: [{ value: '', disabled: true }, Validators.required],
  });
  this.id = Number(aRouter.snapshot.paramMap.get('id'));
}

ngOnInit(): void {

}

onCategoriaSelected(event: any) {
  const selectedCategoryId = Number(event.target.value);
  this.categoriaSeleccionada = selectedCategoryId;
  this.getListInventario(); // Llamada para cargar artículos según la categoría seleccionada
}

getListInventario() {
  this.loading = true;

  this._paginacionService.getListInventario(this.currentPage, this.pageSize).subscribe(
    (response: any) => {
      this.listInventarioArticulosElectrodomesticos = [];
      this.listInventarioArticulosVehiculos = [];

      if (this.categoriaSeleccionada === 1) {
        response.data.forEach((inventario: any) => {
          const articulo = inventario.Articulo;
          if (articulo && articulo.idcategoria === 1) {
            const mappedArticulo: Inventario = {
              id: inventario.id,  // Asegúrate de asignar el id del inventario
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
            this.listInventarioArticulosVehiculos.push(mappedArticulo);
          }
        });
      } else if (this.categoriaSeleccionada === 2) {
        response.data.forEach((inventario: any) => {
          const articulo = inventario.Articulo;
          if (articulo && articulo.idcategoria === 2) {
            const mappedArticulo: Inventario = {
              id: inventario.id,  // Asegúrate de asignar el id del inventario
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
            this.listInventarioArticulosElectrodomesticos.push(mappedArticulo);
          }
        });
      }

      console.log('Artículos Electrodomésticos:', this.listInventarioArticulosElectrodomesticos);
      console.log('Artículos Vehículos:', this.listInventarioArticulosVehiculos);

      this.totalPages = response.totalPages;

      this.loading = false;
    },
    (error: any) => {
      console.error('Error al obtener los artículos:', error);
      this.loading = false;
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
      this.getListInventario();

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
    this.getListInventario();
    this.toastr.warning('El Empleado fue eliminado con exito', 'Empleado eliminado');
  })
}



// constructor(private impresionService: ImpresionService) { }
onImprimir() {
  const entidad = 'Inventario ';
  const encabezado = this.getEncabezado();
  const cuerpo = this.getCuerpo();
  const titulo = 'Lista del Inventario';
  const cuerpoUnico = this.eliminarFilasDuplicadas(cuerpo);
  this.impresionService.imprimir(entidad, encabezado, cuerpoUnico, titulo, true);
}


eliminarFilasDuplicadas(cuerpo: Array<any>): Array<any> {
  const cuerpoUnico: Array<any> = [];
  const filasVistas = new Set();
  cuerpo.forEach((fila) => {
    const filaString = JSON.stringify(fila);
    if (!filasVistas.has(filaString)) {
      cuerpoUnico.push(fila);
      filasVistas.add(filaString);
    }
  });
  return cuerpoUnico;
}



getEncabezado(): string[] { 
if (this.categoriaSeleccionada === 1) {
  return [
    'DESCRIPCION',
    'CARROCERIA',
    'MARCA',
    'MODELO',
    'COLOR',
    'NUMERO SERIE',
    'NUMERO MOTOR',
    'PLACA',
    'OBSERVACION',
    'PRECIO VENTA',
    'PRECIO PRESTAMO',
    'ESTADO'
  ];
} else {
  return [
    'DESCRIPCION',
    'MARCA',
    'MODELO',
    'COLOR',
    'OBSERVACION',
    'PRECIO VENTA',
    'PRECIO PRESTAMO',
    'ESTADO',
  ];
}

 
}

getCuerpo(): any[][] {
  const cuerpo: any[][] = [];
  const filasVistas = new Set();

    if (this.categoriaSeleccionada === 1) {
      
  this.listInventarioArticulosVehiculos.forEach((inventario) => {

     const fila: any[] = [


    inventario.Articulo?.Vehiculo?.descripcion ,
    inventario.Articulo?.Vehiculo?.carroceria ,
    inventario.Articulo?.Vehiculo?.marca ,
    inventario.Articulo?.Vehiculo?.modelo ,
    inventario.Articulo?.Vehiculo?.color ,
    inventario.Articulo?.Vehiculo?.numero_serie ,
    inventario.Articulo?.Vehiculo?.numero_motor ,
    inventario.Articulo?.Vehiculo?.placa ,
    inventario.Articulo?.observaciones,
    inventario.valor_venta,
    inventario.valor_precio,
    inventario.estado_articulo 

  
  ];

  const filaString = fila.join('|');
  if (!filasVistas.has(filaString)) {
    cuerpo.push(fila);
    filasVistas.add(filaString);
  }


});
} else{

       
  this.listInventarioArticulosElectrodomesticos.forEach((inventario) => {

    const fila: any[] = [


   inventario.Articulo?.Electrodomestico?.descripcion,
   inventario.Articulo.Electrodomestico?.marca ,
   inventario.Articulo.Electrodomestico?.modelo,
   inventario.Articulo.Electrodomestico?.color,
   inventario.Articulo.Electrodomestico?.numero_serie,
   inventario.Articulo.observaciones ,
   inventario.valor_venta,
   inventario.valor_precio,
   inventario.Articulo.estado
  
 ];

 const filaString = fila.join('|');
 if (!filasVistas.has(filaString)) {
   cuerpo.push(fila);
   filasVistas.add(filaString);
 }


});
}
  return cuerpo;
}



}
