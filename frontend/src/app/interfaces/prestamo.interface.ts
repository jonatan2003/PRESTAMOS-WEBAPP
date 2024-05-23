import { Cliente } from './cliente.interface';
import { Articulo } from './articulo.interface';



export interface Prestamo {
  id?: number;
  idcliente: number;
  idarticulo: number;
  fecha_prestamo: Date;
  fecha_devolucion: Date;
  monto_prestamo: number;
  monto_pago : number;
  estado: string;
  Cliente?: Cliente;
  Articulo?: Articulo;
}

