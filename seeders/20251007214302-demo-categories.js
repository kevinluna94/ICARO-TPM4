module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      { name: 'Electrónica', description: 'Dispositivos electrónicos', created_at: new Date(), updated_at: new Date() },
      { name: 'Hogar', description: 'Productos para el hogar', created_at: new Date(), updated_at: new Date() },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
