const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth');

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
    res.json(user.toSafeJSON());
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
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id } = req.params;

    // Solo el usuario dueño puede actualizar su info
    if (parseInt(req.user.id) !== parseInt(id)) {
      return res.status(403).json({ error: 'No autorizado para actualizar este usuario' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const updateData = { name, email };
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    await user.update(updateData);
    res.json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar contraseña de usuario
router.put('/:id/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Debes enviar oldPassword y newPassword' });
  }

  // Solo el usuario dueño puede cambiar su contraseña
  if (parseInt(req.user.id) !== parseInt(id)) {
    return res.status(403).json({ error: 'No autorizado para cambiar esta contraseña' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await user.checkPassword(oldPassword);
    if (!valid) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});

// DELETE usuario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Solo el usuario dueño puede eliminar su cuenta
    if (parseInt(req.user.id) !== parseInt(id)) {
      return res.status(403).json({ error: 'No autorizado para eliminar este usuario' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
