'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last4: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      exp_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exp_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      holder_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });
    await queryInterface.addIndex('cards', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cards');
  }
};