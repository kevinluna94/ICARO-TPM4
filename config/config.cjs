require('dotenv').config(); // carga variables de entorno

// Configuración funcional para Sequelize
const base = {
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'icaro_0225',
  logging: false,
  define: {
    underscored: true,
  },
};

module.exports = {
  development: { ...base },
  test: { ...base, database: process.env.DB_NAME_TEST || (base.database + '_test') },
  production: {
    ...base,
    // dialectOptions: { ssl: { require: true } }, // habilitar SSL si es necesario
  },
};

// ----------------------------------------------
// Configuración original del profe (comentada)
// Sequelize CLI configuration for MySQL usage via environment variables
// Adjust your environment or a .env loader accordingly before running migrations/seeders.
//
// require('dotenv').config?.(); // safe optional call if dotenv is present
//
// const base = {
//   dialect: process.env.DB_DIALECT || 'mysql',
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT || 8889),
//   username: process.env.DB_USERNAME || 'root',
//   password: process.env.DB_PASSWORD || null,
//   database: process.env.DB_NAME || 'icaro_0225',
//   logging: false,
//   define: {
//     underscored: true,
//   },
// };
//
// module.exports = {
//   development: { ...base },
//   test: { ...base, database: process.env.DB_NAME_TEST || (base.database + '_test') },
//   production: {
//     ...base,
//     // dialectOptions: { ssl: { require: true } },
//   },
// };
