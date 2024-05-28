import { Articulo } from './articulo.interface';



export interface Inventario {
  id?: number;
  idarticulo: number;
 stock: number;
  estado_articulo:string;
  valor_venta: number;
  valor_precio: number;
  Articulo?: Articulo;
}

