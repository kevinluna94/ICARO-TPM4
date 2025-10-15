const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// RUTA BASE
app.get('/', (req, res) => {
  res.send('Bienvenido al API de Icaro Fullstack');
});

// Rutas de prueba
app.get('/ping', (req, res) => {
  res.send('Servidor activo');
});

// Rutas
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Inicializar DB
(async () => {
  try {
    await sequelize.sync(); // Ojo: en producción, usar migraciones es mejor
    console.log('✅ Database synchronized');
  } catch (e) {
    console.error('❌ Database sync error:', e);
  }
})();

// 404 handler
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send('Error del servidor');
});

// LEVANTAR EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
