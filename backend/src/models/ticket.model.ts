import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Pago from './pago.model';
import Prestamo from './prestamo.model';
import Empleado from './empleado.model';

const Ticket = db.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  num_serie: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  num_ticket: {
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  idempleado: {
    type: DataTypes.INTEGER,
  },
  idpago: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Pago,
      key: 'id'
    }
  },
  idprestamo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Prestamo,
      key: 'id'
    }
  }
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'ticket',
});

// Definir las relaciones
Ticket.belongsTo(Pago, { foreignKey: 'idpago', as: 'Pago' });
Ticket.belongsTo(Prestamo, { foreignKey: 'idprestamo', as: 'Prestamo' });
Ticket.belongsTo(Empleado, { foreignKey: 'idempleado', as: 'Empleado' });

export default Ticket;
