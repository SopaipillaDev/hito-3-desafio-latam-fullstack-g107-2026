import { Router } from 'express';
import { getOrders, getStats } from '../controller/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

router.use(authMiddleware, adminMiddleware);   // todo /admin: token + rol admin

router.get('/orders', getOrders);
router.get('/stats', getStats);

export default router;
