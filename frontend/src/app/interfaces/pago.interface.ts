import { TipoPago } from './tipo_pago.interface';

export interface Pago {
  id?: number;
  tipo_pago: string;
  fecha_pago: Date ;
  interes_pago: number ;
  monto_restante: number ;
  capital_pago: number;
  TipoPago?: TipoPago ; // Relación con la tabla Prestamo
}
