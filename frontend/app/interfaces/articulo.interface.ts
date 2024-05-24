import { Categoria } from './categoria.interface';
import { Vehiculo } from './vehiculo.interface';
import { Electrodomestico } from './electrodomestico.interface';

export interface Articulo {
  id?: number;
  idcategoria: number ;
  idvehiculo: number;
  idelectrodomestico: number;
  observaciones: string;
  estado: string ;
  Categoria?: Categoria; // Relación con la tabla Categoria
  Vehiculo?: Vehiculo; // Relación con la tabla Vehiculo
  Electrodomestico?: Electrodomestico; // Relación con la tabla Electrodomestico
}
