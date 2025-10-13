'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Insertamos los productos si no existen
    await queryInterface.bulkInsert('products', [
      { 
        name: 'Televisor', 
        description: 'Smart TV 50"', 
        price: 1200.00, 
        stock: 10, 
        category_id: 1, 
        image_url: 'https://i.pinimg.com/736x/bb/6c/e8/bb6ce894206da7261fce1606a799ad6e.jpg',
        created_at: new Date(), 
        updated_at: new Date() 
      },
      { 
        name: 'Lámpara', 
        description: 'Lámpara de mesa', 
        price: 50.00, 
        stock: 30, 
        category_id: 2, 
        image_url: 'https://i.pinimg.com/736x/2b/68/49/2b68490e1d937ed5f7232c03aab5db8c.jpg',
        created_at: new Date(), 
        updated_at: new Date() 
      },
    ]);
  },

  down: async (queryInterface) => {
    // Eliminamos los productos insertados
    await queryInterface.bulkDelete('products', {
      name: ['Televisor', 'Lámpara']
    });
  },
};
