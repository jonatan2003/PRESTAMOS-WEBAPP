import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';
import { ImpresionService } from 'src/app/shared/services/impresion.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginacionService } from 'src/app/services/paginacion.service';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';





@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css']
})
export class VentaListComponent {

  listdetalleVentas: DetalleVenta[] = [];
  loading: boolean = false;
  // Define propiedades para la paginación
  currentPage: number = 1;
  pageSize: number = 10; // Tamaño de la página
  totalItems: number;
  totalPages: number = 0;   // Inicializa totalPages en 0
  



  constructor(private _ventaService: VentaService, 
    private _paginacionService: PaginacionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
    private impresionService: ImpresionService
    ) { 



    }

  ngOnInit(): void {
    // Al inicializar el componente, llamar al método para obtener la lista de ventas
    this.getListVentas();
    // Llamar al método para obtener la lista de préstamos en ReservationListComponent
  }

  getListVentas() {
    this.loading = true;
  
    // Ajusta el método para aceptar parámetros de paginación
    this._paginacionService.getListDetaVentas(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.listdetalleVentas = response.data; // Asigna los datos de clientes del objeto devuelto por el servicio
      console.log(this.listdetalleVentas);
      this.loading = false;
  
      // Utiliza totalItems del objeto de respuesta para calcular totalPages
      this.totalPages = response.totalPages;
    });
  }
  
  // Método para cambiar de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getListVentas();
  }
  
  // Método para generar las páginas disponibles
  getPages(): number[] {
    // Retorna un array de números enteros del 1 al totalPages
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }


  
  deleteVenta(id: number) {
    // Mostrar confirmación antes de eliminar la venta
    Swal.fire({
      title: 'Eliminar Venta',
      text: '¿Estás seguro de que deseas eliminar este Venta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación aceptada, realizar eliminación
        this.performDeleteVenta(id);
      }
    });
  }

  performDeleteVenta(id: number) {
    this.loading = true;
    this._ventaService.deleteVenta(id).subscribe(() => {
      this.getListVentas();
      this.toastr.warning('La Venta fue eliminado con exito', 'Venta eliminada');
    });
  }



 
 
  
    onImprimir() {
      const entidad = 'Ventas'; // Nombre de la entidad (para el nombre del archivo PDF)
      const encabezado = this.getEncabezado(); // Obtener el encabezado de la tabla
      const cuerpo = this.getCuerpo(); // Obtener el cuerpo de la tabla
      const titulo = 'Lista de Ventas'; // Título del informe
      
      // Eliminar filas duplicadas del cuerpo
      const cuerpoUnico = this.eliminarFilasDuplicadas(cuerpo);
    
      // Llamar al servicio de impresión
      this.impresionService.imprimir(entidad, encabezado, cuerpoUnico, titulo, true);
  }

  // Método para eliminar filas duplicadas del cuerpo de la tabla
  eliminarFilasDuplicadas(cuerpo: Array<any>): Array<any> {
    const cuerpoUnico: Array<any> = [];
    const filasVistas = new Set(); // Usamos un conjunto para mantener un registro de las filas vistas
    cuerpo.forEach((fila) => {
        // Convertimos la fila en una cadena para poder compararla con otras filas
        const filaString = JSON.stringify(fila);
        if (!filasVistas.has(filaString)) {
            // Si la fila no ha sido vista antes, la agregamos al cuerpo único y al conjunto de filas vistas
            cuerpoUnico.push(fila);
            filasVistas.add(filaString);
        }
    });
    return cuerpoUnico;
  }
  
  
  getEncabezado(): string[] {
      const encabezado: string[] = [
          'EMPLEADO',
          'CLIENTE',
          'ARTICULO',
          'FECHA VENTA',
          'TIPO PAGO',
          'CANTIDAD',
          'PRECIO UNITARIO',
          'SUBTOTAL',
          'TOTAL'
      ];
      
      return encabezado;
  }
  
  getCuerpo(): any[][] {
    const cuerpo: any[][] = [];
    const textosExcluidos = new Set(['Actualizar', 'Eliminar', 'Imprimir']); // Textos a excluir
    const filasVistas = new Set(); // Usar un conjunto para mantener un registro de las filas ya vistas
    
    this.listdetalleVentas.forEach((venta) => {
      const fila: any[] = [
        venta.Venta?.Empleado?.nombre + ' ' + venta.Venta?.Cliente?.apellido,
        venta.Venta?.Empleado?.nombre + ' ' + venta.Venta?.Empleado?.apellidos,
        venta.Venta?.Articulo ? (venta.Venta?.Articulo.Vehiculo ? venta.Venta?.Articulo.Vehiculo.descripcion : (venta.Venta?.Articulo.Electrodomestico ? venta.Venta?.Articulo.Electrodomestico.descripcion : 'No hay descripción disponible')) : 'No hay descripción disponible',
        venta.Venta?.fecha_venta,
        venta.Venta?.tipo_pago,
        venta.cantidad,
        venta.precio_unitario,
        venta.subtotal,
        venta.Venta?.total
      ];
  
      // Convertir la fila en una cadena para compararla
      const filaString = fila.join('|');
  
      // Solo agregar la fila al cuerpo si no se ha visto antes
      if (!filasVistas.has(filaString)) {
        cuerpo.push(fila);
        filasVistas.add(filaString);
      }
    });
  
    return cuerpo;
  }
  
  onImprimirFila(index: number) {
      const detalleventa = this.listdetalleVentas[index];
      this.impresionService.imprimirFilaVentas('Ventas', {
          empleado: detalleventa.Venta?.Empleado?.nombre +" " + detalleventa.Venta?.Empleado?.apellidos || '',
          cliente: detalleventa.Venta?.Cliente?.nombre || '',
          articulo: detalleventa.Venta?.Articulo ?
              (detalleventa.Venta?.Articulo.Vehiculo ?
                  detalleventa.Venta?.Articulo.Vehiculo.descripcion :
                      (detalleventa.Venta?.Articulo.Electrodomestico ?
                          detalleventa.Venta?.Articulo.Electrodomestico.descripcion :
                              'No hay descripción disponible')) :
              'No hay descripción disponible',
              dni : detalleventa.Venta?.Cliente.dni,
          fecha_venta: detalleventa.Venta?.fecha_venta || '',
          tipo_pago: detalleventa.Venta?.tipo_pago || '',
          cantidad: detalleventa.cantidad || '',
          precio_unitario: detalleventa.precio_unitario || '',
          subtotal: detalleventa.subtotal || '',
          total: detalleventa.Venta?.total || ''
      });
  }

    
}
