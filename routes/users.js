const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Product } = require('../models');

// GET todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Product, as: 'products' }] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: [{ model: Product, as: 'products' }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) return res.status(400).json({ error: 'La contraseña es obligatoria' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, passwordHash });
    res.status(201).json(newUser.toSafeJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const updates = { name, email };
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);

    await user.update(updates);
    res.json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE usuario
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
