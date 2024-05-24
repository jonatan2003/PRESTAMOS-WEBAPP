import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DetalleVenta } from 'src/app/interfaces/detaventa.interface';
import { DetaventaService } from 'src/app/services/detaventa.service';



@Component({
  selector: 'app-venta-pending',
  templateUrl: './venta-pending.component.html',
  styleUrls: ['./venta-pending.component.css']
})
export class VentaPendingComponent {

  listDetalleVenta: DetalleVenta[] = []
  loading: boolean = false;

  constructor(private _detalleventaService: DetaventaService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getListDetaventas();
  }

  getListDetaventas() {
    this.loading = true;

    this._detalleventaService.getListDetaventas().subscribe((data:DetalleVenta[]) => {
      this.listDetalleVenta = data;
      this.loading = false;
    })
  }

  deleteDetaventa(id: number) {
    this.loading = true;
    this._detalleventaService.deleteDetaventa(id).subscribe(() => {
      this.getListDetaventas();
      this.toastr.warning('El Articulo fue eliminado con exito', 'Articulo eliminado');
    })
  }


}
