import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Prestamo from './prestamo.model';

const Pago = db.define('Pago', {
  idprestamo: {
    type: DataTypes.INTEGER,
  },
  tipo_pago: {
    type: DataTypes.STRING,
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

// Definir la relación con la tabla Prestamo
Pago.belongsTo(Prestamo, { foreignKey: 'idprestamo', as: 'Prestamo' });

export default Pago;
