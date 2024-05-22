import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Prestamo from '../models/prestamo.model';

const CronogramaPagos = db.define('CronogramaPagos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_prestamo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Prestamo,
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  monto_pagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  }
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'cronograma_pagos',
});

// Definir relaciones
CronogramaPagos.belongsTo(Prestamo, { foreignKey: 'id_prestamo', as: 'Prestamo' });

export default CronogramaPagos;
