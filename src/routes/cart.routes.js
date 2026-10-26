import { Router } from 'express';
import { getCart, addProduct, updateQuantity, removeProduct } from '../controller/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);   // todas las rutas del carrito piden token

router.get('/', getCart);
router.post('/products', addProduct);
router.put('/products/:id', updateQuantity);
router.delete('/products/:id', removeProduct);

export default router;
