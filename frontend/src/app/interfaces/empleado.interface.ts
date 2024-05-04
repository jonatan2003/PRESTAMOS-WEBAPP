
  export interface Empleado {
    id?: number;
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_nacimiento?: Date | null;
    fecha_contratacion?: Date | null;
    genero: string;
    direccion: string;
    telefono: string;
    correo: string;
    tipo_contrato: string;
  }
