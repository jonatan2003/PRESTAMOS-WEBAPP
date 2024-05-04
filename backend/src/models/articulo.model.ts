import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Categoria from './categoria.model';
import Vehiculo from './vehiculo.model';
import Electrodomestico from './electrodometisco.model';

const Articulo = db.define('Articulo', {
  idcategoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idvehiculo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idelectrodomestico: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'articulo',
});

// Definir las relaciones con las tablas Categoria, Vehiculo y Electrodomestico
Articulo.belongsTo(Categoria, { foreignKey: 'idcategoria', as: 'Categoria' });
Articulo.belongsTo(Vehiculo, { foreignKey: 'idvehiculo', as: 'Vehiculo' });
Articulo.belongsTo(Electrodomestico, { foreignKey: 'idelectrodomestico', as: 'Electrodomestico' });

export default Articulo;
