'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('products');
    if (!table.image_url) {
      await queryInterface.addColumn('products', 'image_url', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('products');
    if (table.image_url) {
      await queryInterface.removeColumn('products', 'image_url');
    }
  }
};
