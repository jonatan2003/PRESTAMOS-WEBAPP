import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Articulo from './articulo.model'; // Asegúrate de que la ruta sea correcta

const Inventario = db.define('Inventario', {
  idarticulo: {
    type: DataTypes.INTEGER,
  },
  stock: {
    type: DataTypes.INTEGER,
  },
  estado_articulo: {
    type: DataTypes.STRING,
  },
  valor_venta: {
    type: DataTypes.DECIMAL(10, 2),
  },
  valor_precio: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'inventario',
});

// Definir la relación con la tabla Articulo
Inventario.belongsTo(Articulo, { foreignKey: 'idarticulo', as: 'Articulo' });

export default Inventario;
