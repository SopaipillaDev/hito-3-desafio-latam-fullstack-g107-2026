import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/user.routes.js';
import categoriesRoutes from './routes/category.routes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);

// Middleware de manejo de errores centralizado
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  console.error('Error:', err);
  res.status(status).json({ error: message });
});

export default app;

