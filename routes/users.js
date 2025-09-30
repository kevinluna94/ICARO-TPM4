var express = require('express');
var router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { User } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET /users/me - perfil del usuario autenticado
router.get('/me', authMiddleware, async function(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ user: user.toSafeJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

module.exports = router;
