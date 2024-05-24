import { DetalleVenta } from "./detaventa.interface";
import { TipoComprobante } from "./tipo_comprobante.interface";
export interface Comprobante_venta {
    id?: number;
    igv: number ;
    descuento: number;
    iddetalleventa: number;
    idtipo_comprobante: number;
    num_serie: string ;
    DetalleVenta?:DetalleVenta;
    TipoComprobante?:TipoComprobante;
}