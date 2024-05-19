import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import TipoSerie from './tipo_serie.model';

const TipoComprobante = db.define('TipoComprobante', {
  
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  idserie: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoSerie,
      key: 'id',
    },
  },
}, {
  tableName: 'tipo_comprobante',
  createdAt: false,
  updatedAt: false,
});


TipoComprobante.belongsTo(TipoSerie, { foreignKey: 'idserie', as: 'TipoSerie' });


export default TipoComprobante;
