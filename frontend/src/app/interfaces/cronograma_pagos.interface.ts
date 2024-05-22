import { Prestamo } from "./prestamo.interface";

export interface CronogramaPago {
    id?: number;
    id_prestamo: number;
    fecha_vencimiento: Date; // 
    monto: number;
    monto_pagado: number;
    Prestamo?: Prestamo; // 
  }