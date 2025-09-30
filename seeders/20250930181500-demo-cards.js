'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Try to find demo user by email used in previous seeder or fallback to id 1
    const [users] = await queryInterface.sequelize.query("SELECT id, email FROM users ORDER BY id ASC LIMIT 1");
    if (!users || users.length === 0) {
      // Create a demo user if none exists (for convenience when seeding in a fresh DB)
      const passwordHash = await bcrypt.hash('secreto123', 10);
      const [result] = await queryInterface.bulkInsert('users', [{
        name: 'Demo',
        email: 'demo@example.com',
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      }], { returning: true });
      const demoUserId = result ? result.id : 1; // depending on dialect, returning may not work
      const [rows] = await queryInterface.sequelize.query("SELECT id FROM users WHERE email='demo@example.com' LIMIT 1");
      const userId = rows && rows[0] ? rows[0].id : demoUserId;
      await queryInterface.bulkInsert('cards', [
        {
          user_id: userId,
          brand: 'VISA',
          last4: '4242',
          exp_month: 12,
          exp_year: 2030,
          holder_name: 'Demo User',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: userId,
          brand: 'MASTERCARD',
          last4: '4444',
          exp_month: 11,
          exp_year: 2029,
          holder_name: 'Demo User',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } else {
      const userId = users[0].id;
      await queryInterface.bulkInsert('cards', [
        {
          user_id: userId,
          brand: 'VISA',
          last4: '4242',
          exp_month: 12,
          exp_year: 2030,
          holder_name: 'Demo User',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: userId,
          brand: 'AMEX',
          last4: '0005',
          exp_month: 10,
          exp_year: 2028,
          holder_name: 'Demo User',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cards', null, {});
  }
};