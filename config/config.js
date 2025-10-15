require('dotenv').config();

const base = {
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
  },
};

module.exports = {
  development: {
    // Si existe DB_URL (Railway pública), usarla directamente
    url: process.env.DB_URL,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    url: process.env.DB_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}_test`,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    logging: false,
  },
};
