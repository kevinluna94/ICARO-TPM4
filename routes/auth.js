const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  [
    body('name').optional().isString().isLength({ min: 1 }).withMessage('Nombre inválido'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validate,
  ],
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = signToken(user);
      return res.status(201).json({ user: user.toSafeJSON(), token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isString().withMessage('Contraseña requerida'),
    validate,
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
      const ok = await user.checkPassword(password);
      if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
      const token = signToken(user);
      return res.json({ user: user.toSafeJSON(), token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
);

module.exports = router;