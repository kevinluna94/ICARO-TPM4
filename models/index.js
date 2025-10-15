const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializar Sequelize
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, { dialect: 'mysql', logging: false })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false,
      }
    );

// Cargar modelos
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);

// Relaciones
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasMany(Product, { foreignKey: 'user_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Verificar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
  }
})();

// Exportar
const db = { sequelize, Sequelize, User, Category, Product };
module.exports = db;
