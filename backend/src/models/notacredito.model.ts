import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const NotaCredito = db.define('NotaCredito', {
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  tableName: 'notacredito',
  createdAt: false,
  updatedAt: false,
});

export default NotaCredito;
