import { Empleado } from "./empleado.interface";

export interface Usuario {
  id?: number;
  id_empleado: number;
  usuario: string;
  password: string;
  permiso: string;
  Empleado?: Empleado | null;

}
