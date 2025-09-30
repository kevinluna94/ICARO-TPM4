const { Sequelize } = require('sequelize');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';

// Use SQLite for simplicity. You can switch to another dialect via env.
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', (isTest ? 'test.sqlite' : 'database.sqlite')),
  logging: false,
});

// Load models
const User = require('./user')(sequelize);
const Card = require('./card')(sequelize);

// Associations
User.hasMany(Card, { foreignKey: 'user_id', as: 'cards' });
Card.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = { sequelize, Sequelize, User, Card };

module.exports = db;