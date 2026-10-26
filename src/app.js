import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/user.routes.js';
import categoriesRoutes from './routes/category.routes.js';
import productsRoutes from './routes/product.routes.js';
import productImagesRoutes from './routes/productImages.routes.js';
import productFilesRoutes from './routes/productFiles.routes.js';
import reviewsRoutes from './routes/review.routes.js';
import favoritesRoutes from './routes/favorite.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ordersRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { login } from './controller/user.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', login);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productImagesRoutes);
app.use('/products', productFilesRoutes);
app.use('/products', reviewsRoutes);
app.use('/products', productsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/admin', adminRoutes);

// Manejador de errores: todas las respuestas de error van como { message }
app.use((err, req, res, next) =>
{
    const status = err.status || 500;
    const message = err.status ? err.message : 'Error interno del servidor';
    console.error('Error:', err.message);
    res.status(status).json({ message });
});

export default app;
