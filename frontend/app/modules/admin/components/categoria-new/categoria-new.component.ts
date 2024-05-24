import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from 'src/app/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';



@Component({
  selector: 'app-categoria-new',
  templateUrl: './categoria-new.component.html',
  styleUrls: ['./categoria-new.component.css']
})
export class CategoriaNewComponent {

  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar';


  constructor(private fb: FormBuilder,
    private _categoriasService: CategoriaService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],

      // ... Otros campos del formulario de categoria
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      // Es editar
      this.operacion = 'Editar';
      this.getCategoria(this.id);
    }
  }


  getCategoria(id: number) {
    this.loading = true;
    this._categoriasService.getCategoria(id).subscribe((data: Categoria) => { // Corregido a 'Cliente'
      this.loading = false;
      this.form.setValue({
        nombre: data.nombre,

        // ... Otros campos del formulario de categorias según la interfaz
      });
    });
  }



  addCategoria() {
    const categoria: Categoria = {
      nombre: this.form.value.nombre,
      // ... Otros campos del formulario de categorias según la interfaz
    };

    this.loading = true;

    if (this.id !== 0) {
      // Es editar
      categoria.id = this.id;
      this._categoriasService.updateCategoria(this.id, categoria).subscribe(() => {
        this.toastr.info(`El categoria ${categoria.nombre} fue actualizado con éxito`, 'categoria actualizado');
        this.loading = false;
        this.router.navigate(['/admin/categoria-list']);
      });
    } else {
      // Es agregar
      this._categoriasService.saveCategoria(categoria).subscribe(() => {
        this.toastr.success(`El categoria ${categoria.nombre} fue registrado con éxito`, 'categoria registrado');
        this.loading = false;
        this.router.navigate(['/admin/categoria-list']);
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
