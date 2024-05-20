import { Prestamo } from './prestamo.interface';
import { Pago } from './pago.interface';



export interface Ticket {
  id?: number;
  num_serie: string;
  num_ticket: string;
  idpago: number;
  idprestamo: number;
  Pago?: Pago;
  Prestamo?: Prestamo;

}

