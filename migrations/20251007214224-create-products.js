'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agrega la columna image_url a la tabla products
    await queryInterface.addColumn('products', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Elimina la columna image_url de la tabla products
    await queryInterface.removeColumn('products', 'image_url');
  }
};
