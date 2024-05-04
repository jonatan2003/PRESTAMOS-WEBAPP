import { Venta } from './venta.interface';

export interface DetalleVenta {
  id?: number;
  idventa: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  Venta?: Venta;
}

