import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const TipoPago = db.define('TipoPago', {

  nombre_tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'tipo_pago',
});

export default TipoPago;
