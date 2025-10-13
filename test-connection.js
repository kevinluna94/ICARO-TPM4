const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con MySQL');
    await sequelize.sync({ force: true }); // recrea tablas, útil para test
    console.log('Tablas sincronizadas correctamente');
  } catch (err) {
    console.error('❌ Error de conexión o sincronización:', err);
  } finally {
    await sequelize.close();
  }
})();
