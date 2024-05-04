import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const Vehiculo = db.define('Vehiculo', {
  carroceria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_serie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_motor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'vehiculo',
});

export default Vehiculo;
