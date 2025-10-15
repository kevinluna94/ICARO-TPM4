const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializar Sequelize usando la URL de Railway
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  logging: false, 
});

// Cargar modelos
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);

// Relaciones
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasMany(Product, { foreignKey: 'user_id', as: 'products' }); 
Product.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); // opcional
// Exportar
const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
};

module.exports = db;
