import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controller/favorite.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);   // todas las rutas de favoritos piden token

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:product_id', removeFavorite);

export default router;
