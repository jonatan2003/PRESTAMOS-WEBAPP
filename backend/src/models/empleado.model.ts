import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const Empleado = db.define('Empleado', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
  },
  fecha_contratacion: {
    type: DataTypes.DATE,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_contrato: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
    defaultValue: 'ACTIVO',
    allowNull: false,
  },

}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'empleado',
});

export default Empleado;
