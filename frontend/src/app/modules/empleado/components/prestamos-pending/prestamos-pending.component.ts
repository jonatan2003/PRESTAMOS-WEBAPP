import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pago } from 'src/app/interfaces/pago.interface';
import { PagosService } from 'src/app/services/pago.service';




@Component({
  selector: 'app-prestamos-pending',
  templateUrl: './prestamos-pending.component.html',
  styleUrls: ['./prestamos-pending.component.css']
})
export class PrestamosPendingComponent {



  listPago: Pago[] = []
  loading: boolean = false;

  constructor(private _pagoService: PagosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getListPagos();
  }

  getListPagos() {
    this.loading = true;

    this._pagoService.getListPagos().subscribe((data: Pago[]) => {
      this.listPago = data;
      this.loading = false;
    })
  }

  deletePago(id: number) {
    this.loading = true;
    this._pagoService.deletePago(id).subscribe(() => {
      this.getListPagos();
      this.toastr.warning('El Pago fue eliminado con exito', 'Pago eliminado');
    })
  }
}
