import { Prestamo } from "./prestamo.interface";

export interface CronogramaPago {
    id?: number;
    id_prestamo: number;
    fecha_pago: Date; // 
    monto_pagado: number;
    Prestamo?: Prestamo; // 
  }