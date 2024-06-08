import { Venta } from './venta.interface';
import { TipoComprobante } from "./tipo_comprobante.interface";
import { NotaCredito } from './notacredito.interface';

export interface Comprobante_venta {
    
    id?: number;
    idventa: number;
    igv: number ;
    descuento: number;
    idtipo_comprobante: number;
    num_serie: string ;
    estado: 'EMITIDO' | 'ANULADO';
    razon_anulacion: string | null;
    idnotacredito: number | null;
    Venta?: Venta;
    TipoComprobante?:TipoComprobante;
    NotaCredito?: NotaCredito;

}