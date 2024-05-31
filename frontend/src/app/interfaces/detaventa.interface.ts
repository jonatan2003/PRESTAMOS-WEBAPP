import { Venta } from './venta.interface';
import { Articulo } from './articulo.interface';


export interface DetalleVenta {
  id?: number;
  idventa: number;
  idarticulo: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  Venta?: Venta;
  Articulo?:Articulo;

}

