import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
@Component({
  selector: 'app-client-new',
  templateUrl: './client-new.component.html',
  styleUrls: ['./client-new.component.css']
})
export class ClientNewComponent {


  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';

  constructor(private fb: FormBuilder,
    private _clientesService: ClienteService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
      rubro: ['', Validators.required],
      // ... Otros campos del formulario de clientes
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar';
      this.getCliente(this.id);
    }
  }

  getCliente(id: number) {
    this.loading = true;
    this._clientesService.getCliente(id).subscribe((data: Cliente) => { // Corregido a 'Cliente'
      this.loading = false;
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        dni: data.dni,
        telefono: data.telefono,
        rubro: data.rubro
        // ... Otros campos del formulario de clientes según la interfaz
      });
    });
  }



  addCliente() {
    const cliente: Cliente = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      direccion: this.form.value.direccion,
      dni: this.form.value.dni,
      ruc: this.form.value.ruc,
      razon_social: this.form.value.razon_social,
      telefono: this.form.value.telefono,
      rubro: this.form.value.rubro,
      // ... Otros campos del formulario de clientes según la interfaz
    };

    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      cliente.id = this.id;
      this._clientesService.updateCliente(this.id, cliente).subscribe(() => {
        this.toastr.info(`El cliente ${cliente.nombre} fue actualizado con éxito`, 'Cliente actualizado');
        this.loading = false;
        this.router.navigate(['admin/client-list']);
      });
    } else {
      // Es agregar
      this._clientesService.saveCliente(cliente).subscribe(() => {
        this.toastr.success(`El cliente ${cliente.nombre} fue registrado con éxito`, 'Cliente registrado');
        this.loading = false;
        this.router.navigate(['admin/client-list']);
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
