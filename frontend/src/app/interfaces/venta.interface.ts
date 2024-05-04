import { Empleado } from './empleado.interface';
import { Cliente } from './cliente.interface';
import { Articulo } from './articulo.interface';


export interface Venta {
  id?: number;
  idempleado: number;
  idcliente: number;
  idarticulo: number;
  fecha_venta: Date;
  total: number;
  tipo_pago: string;
  Cliente?: Cliente;
  Empleado?: Empleado;
  Articulo?:Articulo;

}
