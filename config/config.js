require('dotenv').config();
console.log('ENV DB_URL:', process.env.DB_URL);

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: process.env.DB_URL,
    dialect: 'mysql',
    logging: console.log,
  },
};
