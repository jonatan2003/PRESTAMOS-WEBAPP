import { Venta } from './venta.interface';
import { TipoComprobante } from "./tipo_comprobante.interface";

export interface Comprobante_venta {
    
    id?: number;
    idventa: number;
    igv: number ;
    descuento: number;
    idtipo_comprobante: number;
    num_serie: string ;
    Venta?: Venta;
    TipoComprobante?:TipoComprobante;
}