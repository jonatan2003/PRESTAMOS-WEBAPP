import { Empleado } from './empleado.interface';
import { Cliente } from './cliente.interface';


export interface Venta {
  id?: number;
  idempleado: number;
  idcliente: number;
  fecha_venta: Date;
  total: number;
  tipo_pago: string;
  Cliente?: Cliente;
  Empleado?: Empleado;

}
