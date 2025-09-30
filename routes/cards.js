const express = require('express');
const { body, param } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { Card } = require('../models');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// GET /cards - list cards of current user
router.get('/', async (req, res) => {
  try {
    const cards = await Card.findAll({ where: { userId: req.user.id }, order: [['id', 'ASC']] });
    return res.json({ cards: cards.map((c) => c.toJSONSafe()) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar tarjetas' });
  }
});

// GET /cards/:id - show card if belongs to user
router.get(
  '/:id',
  [param('id').isInt().toInt(), validate],
  async (req, res) => {
    try {
      const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
      if (!card) return res.status(404).json({ error: 'Tarjeta no encontrada' });
      return res.json({ card: card.toJSONSafe() });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al obtener tarjeta' });
    }
  }
);

// POST /cards - create a new card for current user
router.post(
  '/',
  [
    body('brand').optional().isString().isLength({ min: 1 }).withMessage('Marca inválida'),
    body('last4').isString().matches(/^\d{4}$/).withMessage('last4 debe ser 4 dígitos'),
    body('expMonth').isInt({ min: 1, max: 12 }).withMessage('Mes inválido'),
    body('expYear').isInt({ min: 2000 }).withMessage('Año inválido'),
    body('holderName').optional().isString().isLength({ min: 1 }).withMessage('Nombre de titular inválido'),
    validate,
  ],
  async (req, res) => {
    try {
      const { brand, last4, expMonth, expYear, holderName } = req.body;
      const card = await Card.create({ userId: req.user.id, brand, last4, expMonth, expYear, holderName });
      return res.status(201).json({ card: card.toJSONSafe() });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al crear tarjeta' });
    }
  }
);

// PUT /cards/:id - update allowed fields
router.put(
  '/:id',
  [
    param('id').isInt().toInt(),
    body('brand').optional().isString().isLength({ min: 1 }),
    body('last4').optional().isString().matches(/^\d{4}$/),
    body('expMonth').optional().isInt({ min: 1, max: 12 }),
    body('expYear').optional().isInt({ min: 2000 }),
    body('holderName').optional().isString().isLength({ min: 1 }),
    validate,
  ],
  async (req, res) => {
    try {
      const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
      if (!card) return res.status(404).json({ error: 'Tarjeta no encontrada' });
      const fields = ['brand', 'last4', 'expMonth', 'expYear', 'holderName'];
      for (const f of fields) {
        if (req.body[f] !== undefined) card[f] = req.body[f];
      }
      await card.save();
      return res.json({ card: card.toJSONSafe() });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al actualizar tarjeta' });
    }
  }
);

// DELETE /cards/:id - delete card
router.delete(
  '/:id',
  [param('id').isInt().toInt(), validate],
  async (req, res) => {
    try {
      const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
      if (!card) return res.status(404).json({ error: 'Tarjeta no encontrada' });
      await card.destroy();
      return res.status(204).send();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error al eliminar tarjeta' });
    }
  }
);

module.exports = router;
