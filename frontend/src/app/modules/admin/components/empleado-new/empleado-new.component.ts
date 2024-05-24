import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empleado } from 'src/app/interfaces/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';





@Component({
  selector: 'app-empleado-new',
  templateUrl: './empleado-new.component.html',
  styleUrls: ['./empleado-new.component.css']
})
export class EmpleadoNewComponent {


  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

  constructor(private fb: FormBuilder,
    private _empleadosService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
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
    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar';
      this.getEmpleado(this.id);
    }
  }

  getEmpleado(id: number) {
    this.loading = true;
    this._empleadosService.getEmpleado(id).subscribe((data: Empleado) => { // Corregido a 'Empleado'
      this.loading = false;
      this.form.setValue({
        nombre: data.nombre,
        apellidos: data.apellidos,
        dni: data.dni,
        fecha_nacimiento: data.fecha_nacimiento,
        fecha_contratacion: data.fecha_contratacion,
        genero: data.genero,
        direccion: data.direccion,
        numero_telefono: data.telefono,
        correo_electronico: data.correo,
        tipo_contrato: data.tipo_contrato,
        // ... Otros campos del formulario de empleado según la interfaz
      });
    });
  }


  addEmpleado() {
    const empleado: Empleado = {
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos,
      dni: this.form.value.dni,
      fecha_nacimiento: this.form.value.fecha_nacimiento,
      fecha_contratacion: this.form.value.fecha_contratacion,
      genero: this.form.value.genero,
      direccion: this.form.value.direccion,
      telefono: this.form.value.telefono,
      correo: this.form.value.correo,
      tipo_contrato: this.form.value.tipo_contrato,
      // ... Otros campos del formulario de empleado según la interfaz
    };

    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      empleado.id = this.id;
      this._empleadosService.updateEmpleado(this.id, empleado).subscribe(() => {
        this.toastr.info(`El empleado ${empleado.nombre} fue actualizado con éxito`, 'Empleado actualizado');
        this.loading = false;
        this.router.navigate(['admin/empleado-list']);        // this.router.navigate(['/empleado-list']);
      });
    } else {
      // Es agregar
      this._empleadosService.saveEmpleado(empleado).subscribe(() => {
        this.toastr.success(`El empleado ${empleado.nombre} fue registrado con éxito`, 'Empleado registrado');
        this.loading = false;
        this.router.navigate(['admin/empleado-list']);        // this.router.navigate(['/empleado-list']);
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
