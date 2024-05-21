import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import TipoPago from './tipo_pago.model';

const Pago = db.define('Pago', {
  id_tipopago: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
  },
  interes_pago: {
    type: DataTypes.DECIMAL(10, 2),
  },
  monto_restante: {
    type: DataTypes.DECIMAL(10, 2),
  },
  capital_pago: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'pago',
});

Pago.belongsTo(TipoPago, { foreignKey: 'id_tipopago', as: 'TipoPago' });


export default Pago;
