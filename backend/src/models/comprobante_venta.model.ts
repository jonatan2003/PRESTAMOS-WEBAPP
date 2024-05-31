import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import TipoComprobante from './tipo_comprobante.model';
import Venta from './venta.model';

const ComprobanteVenta = db.define('ComprobanteVenta', {
  idventa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venta,
      key: 'id'
    }
  },
  igv: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  descuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
 
  idtipo_comprobante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoComprobante,
      key: 'id'
    }
  },
  num_serie: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
}, {
  tableName: 'comprobante_venta',
  createdAt: false,
  updatedAt: false,
});

// Relaciones
ComprobanteVenta.belongsTo(Venta, { foreignKey: 'idventa', as: 'Venta' });
ComprobanteVenta.belongsTo(TipoComprobante, { foreignKey: 'idtipo_comprobante', as: 'TipoComprobante'});

export default ComprobanteVenta;
