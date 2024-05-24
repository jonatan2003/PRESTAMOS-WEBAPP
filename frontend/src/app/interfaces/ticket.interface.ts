import { Prestamo } from './prestamo.interface';
import { Pago } from './pago.interface';
import { Empleado } from './empleado.interface';



export interface Ticket {
  id?: number;
  num_serie: string;
  num_ticket: string;
  idempleado: number;
  idpago: number;
  idprestamo: number;
  Pago?: Pago;
  Prestamo?: Prestamo;
  Empleado?: Empleado;
}

