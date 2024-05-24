import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaService } from 'src/app/services/venta.service';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { Date } from 'core-js';


@Component({
  selector: 'app-venta-new',
  templateUrl: './venta-new.component.html',
  styleUrls: ['./venta-new.component.css']
})
export class VentaNewComponent {

  empleados: Empleado[] = []; // Variable para almacenar los productos disponibles
  listEmpleados: Empleado[] = [];
  clientes: Cliente[] = []; // Variable para almacenar los productos disponibles
  listClientes: Cliente[] = [];

  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

  constructor(private fb: FormBuilder,
    private _empleadosService: EmpleadoService,
    private _clientesService: ClienteService,
    private _ventasService: VentaService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      idempleado: ['', Validators.required],
      idcliente: ['', Validators.required],
      idarticulo: ['', Validators.required],
      fecha_venta: ['', Validators.required],
      monto_total: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      tipo_pago: ['', Validators.required],
      // ... Otros campos del formulario de ventas
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {

    // Obtener la fecha actual
const fechaActual = new Date();
// Formatear la fecha actual en el formato de fecha de HTML5 (YYYY-MM-DD)
const fechaActualString = fechaActual.toISOString().slice(0, 10);
// Establecer la fecha actual como valor inicial del campo de formulario
this.form.patchValue({
  fecha_venta: fechaActualString
});

    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar';
      this.getVenta(this.id);
    }
    this.getListEmpleados();
    this.getListClientes();

  }

  getListEmpleados() {
    this.loading = true;

    this._empleadosService.getListEmpleados().subscribe((data: Empleado[]) => {
      this.listEmpleados = data;
      this.loading = false;
    })
  }
  getListClientes() {
    this.loading = true;

    this._clientesService.getListClientes().subscribe((data: Cliente[]) => {
      this.listClientes = data;
      this.loading = false;
    })
  }

  onEmpleadoSelected(value: any) {
    const selectedProductId = value as number; // Realizar la conversión de tipo
    // Realiza las acciones que necesites con el ID del producto seleccionado
  }

  onClienteSelected(value: any) {
    const selectedProductId = value as number; // Realizar la conversión de tipo
    // Realiza las acciones que necesites con el ID del producto seleccionado
  }


  getVenta(id: number) {
    this.loading = true;
    this._ventasService.getVenta(id).subscribe((data: Venta) => { // Corregido a 'Venta'
      this.loading = false;
      this.form.setValue({
        idempleado: data.idempleado,
        idcliente: data.idcliente,
        idarticulo: data.idarticulo,
        fecha_venta: data.fecha_venta,
        tipo_pago: data.tipo_pago,

        // ... Otros campos del formulario de ventas según la interfaz
      });
    });
  }


  addVenta() {
    const venta: Venta = {
      idempleado: this.form.value.idempleado,
      idcliente: this.form.value.idcliente,
      idarticulo: this.form.value.idarticulo,
      fecha_venta: this.form.value.fecha_venta,
      total: this.form.value.total,
      tipo_pago: this.form.value.tipo_pago,
      // ... Otros campos del formulario de ventas según la interfaz
    };

    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      venta.id = this.id;
      this._ventasService.updateVenta(this.id, venta).subscribe(() => {
        this.toastr.info(`El venta ${venta.idcliente} fue actualizado con éxito`, 'venta actualizado');
        this.loading = false;
        this.router.navigate(['/admin/venta-list']);
      });
    } else {
      // Es agregar
      this._ventasService.saveVenta(venta).subscribe(() => {
        this.toastr.success(`El venta ${venta.idcliente} fue registrado con éxito`, 'venta registrado');
        this.loading = false;

        this.router.navigate(['/admin/venta-list']);
      });
    }
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
