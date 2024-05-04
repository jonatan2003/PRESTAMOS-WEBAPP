import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Pago from './pago.model';
import DetalleVenta from './detalleventa.model';

const Ticket = db.define('Ticket', {
  nro_serie: {
    type: DataTypes.STRING,
  },
  nro_ticket: {
    type: DataTypes.INTEGER,
  },
  
  tipo_comprobante: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_pago: {
    type: DataTypes.INTEGER,
  },
  id_detalleventa: {
    type: DataTypes.INTEGER,
  },
 
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'tciket',
});

// Definir la relación con la tabla Prestamo
Ticket.belongsTo(Pago, { foreignKey: 'id_pago', as: 'Pago' });
Ticket.belongsTo(DetalleVenta, { foreignKey: 'id_detalleventa', as: 'DetalleVenta' });

export default Ticket;
