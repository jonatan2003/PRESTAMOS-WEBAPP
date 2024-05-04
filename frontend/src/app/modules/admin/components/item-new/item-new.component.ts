import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Articulo } from 'src/app/interfaces/articulo.interface';
import { ArticulosService } from 'src/app/services/articulo.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { ElectrodomesticoService } from 'src/app/services/electrodomestico.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { Electrodomestico } from 'src/app/interfaces/electrodomestico.interface';
import { Vehiculo } from 'src/app/interfaces/vehiculo.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-item-new',
  templateUrl: './item-new.component.html',
  styleUrls: ['./item-new.component.css']
})
export class ItemNewComponent {
  categorias: Categoria[] = []; // Variable para almacenar los productos disponibles
  listCategorias: Categoria[] = [];
  listElectrodomesticos: Electrodomestico [] = [];
  listVehiculos: Vehiculo []  = [];
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';
  categoriaSeleccionada: number; // Variable para almacenar la categoría seleccionada
  formVehiculo: FormGroup;
  formElectrodomestico: FormGroup;

   vehiculoId: number | null = null;;
   electrodomesticoId: number | null = null;


  constructor(private fb: FormBuilder,
    private _categoriasService: CategoriaService,
    private _articulosService: ArticulosService,
    private _electrodomesticoService: ElectrodomesticoService,
    private _vehiculoService: VehiculoService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
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

      this.id = Number(aRouter.snapshot.paramMap.get('id'));

  }

  ngOnInit(): void {

  }


  saveArticulo() {
    let idcategoria: number;
    // let id: number ; // Inicializarlo como null al agregar un nuevo artículo
    let idvehiculo: number | null;
    let idelectrodomestico: number | null;

    let estado = ""
    // Obtener ID de categoría seleccionada
    idcategoria = this.categoriaSeleccionada;

    // Obtener ID de vehículo o electrodoméstico según la categoría seleccionada
    if (idcategoria === 1) {
      idvehiculo = this.vehiculoId;
      idelectrodomestico = null;
    } else if (idcategoria === 2) {
      idvehiculo = null;
      idelectrodomestico = this.electrodomesticoId;
    } else {
      // Manejar el caso si la categoría no está seleccionada correctamente
      return;
    }

    // Crear objeto Articulo con los IDs obtenidos
    const nuevoArticulo: Articulo = {
      idcategoria,
     //  id, // Se deja como null al agregar un nuevo artículo
      idvehiculo,
      idelectrodomestico,
      estado : "disponible"
      // Agrega otras propiedades necesarias aquí
    };

    // Guardar el artículo utilizando el servicio ArticulosService
    this._articulosService.saveArticulo(nuevoArticulo).subscribe(() => {
      // Redireccionar a la lista de artículos u otro lugar según sea necesario
      this.router.navigate(['/admin/reservation-new']);
    }, error => {
      // Manejar errores si la operación de guardar falla
      console.error('Error al guardar el artículo:', error);
      this.toastr.error('Error al guardar el artículo', 'Error');
    });
  }




  onCategoriaSelected(event: any) {
    const selectedCategoryId = Number(event.target.value);
    this.categoriaSeleccionada = selectedCategoryId;
  }


  addVehiculo() {
    const vehiculo: Vehiculo = this.formVehiculo.value;
    this.loading = true;

    this._vehiculoService.saveVehiculo(vehiculo).subscribe(
      (response: any) => { // Aquí se define 'response' como el parámetro de la función de suscripción
        this.toastr.success(`El vehículo ${vehiculo.descripcion} fue registrado con éxito`, 'Vehículo registrado');
        this.loading = false;

        // Obtener el ID del vehículo desde la respuesta del servicio
        this.vehiculoId = response.id;

        // Asignar el valor de idelectrodomestico como null ya que no se está guardando un electrodoméstico
        this.electrodomesticoId = null;

        // Llamar a la función saveArticulo() después de obtener los IDs
        this.saveArticulo();
      },
      (error: any) => { // Manejo de errores
        console.error('Error al guardar el vehículo:', error);
        this.toastr.error('Error al guardar el vehículo', 'Error');
        this.loading = false;
      }
    );
}


addElectrodomestico() {
    const electrodomestico: Electrodomestico = this.formElectrodomestico.value;
    this.loading = true;

    this._electrodomesticoService.saveElectrodomestico(electrodomestico).subscribe(
      (response: any) => { // Aquí se define 'response' como el parámetro de la función de suscripción
        this.toastr.success(`El electrodoméstico ${electrodomestico.descripcion} fue registrado con éxito`, 'Electrodoméstico registrado', {

          timeOut: 3000, // Duración en milisegundos (3 segundos en este caso)
          progressBar: true, // Muestra la barra de progreso
          progressAnimation: 'increasing', // Animación de la barra de progreso
          positionClass: 'toast-top-right'
          }); 
        this.loading = false;

        // Obtener el ID del electrodoméstico desde la respuesta del servicio
        this.electrodomesticoId = response.id;

        // Asignar el valor de idvehiculo como null ya que no se está guardando un vehículo
        this.vehiculoId = null;

        // Llamar a la función saveArticulo() después de obtener los IDs
        this.saveArticulo();
      },
      (error: any) => { // Manejo de errores
        console.error('Error al guardar el electrodoméstico:', error);
        this.toastr.error('Error al guardar el electrodoméstico', 'Error');
        this.loading = false;
      }
    );
}





  onlyNumberKey(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  onlyTextKey(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !== 32) {
      event.preventDefault();
    }
  }


}
