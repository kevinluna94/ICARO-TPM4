const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid authorization format' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains at least id and email
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function signToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return token;
}

module.exports = { authMiddleware, signToken, JWT_SECRET };