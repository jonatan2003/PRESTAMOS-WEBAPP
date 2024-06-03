import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const Cliente = db.define('Cliente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ruc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rubro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'cliente',
});

export default Cliente;
