'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('secreto123', 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Usuario Demo',
        email: 'demo@example.com',
        password_hash: passwordHash,
        created_at: now,
        updated_at: now,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'demo@example.com' }, {});
  }
};
