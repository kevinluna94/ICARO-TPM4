require('dotenv').config();
console.log('ENV DB_URL:', process.env.DB_URL);
console.log('ENV DATABASE_URL:', process.env.DATABASE_URL);

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: process.env.DB_URL || process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: console.log, // muestra queries en los logs
  },
};
