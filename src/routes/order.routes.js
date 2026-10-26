import { Router } from 'express';
import { createOrder, payOrder, getMyOrders, getOrderById, getOrderFiles } from '../controller/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);   // todas las rutas de órdenes piden token

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/payment', payOrder);
router.get('/:id/files', getOrderFiles);

export default router;
