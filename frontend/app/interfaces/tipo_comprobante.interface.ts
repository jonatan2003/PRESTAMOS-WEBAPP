import { TipoSerie } from "./tipo_serie.interface";
export interface TipoComprobante {

 id?: number;
  nombre: string ;
  idserie: number ;
  TipoSerie?:TipoSerie;
}