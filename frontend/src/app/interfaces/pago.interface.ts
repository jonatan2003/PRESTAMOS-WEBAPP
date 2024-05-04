import { Prestamo } from './prestamo.interface';

export interface Pago {
  id?: number;
  idprestamo: number;
  tipo_pago: string;
  fecha_pago: Date ;
  interes_pago: number ;
  monto_restante: number ;
  capital_pago: number;
  Prestamo?: Prestamo ; // Relación con la tabla Prestamo
}
