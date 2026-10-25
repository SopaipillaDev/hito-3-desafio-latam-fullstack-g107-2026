import { Router } from 'express';
import {
  getProductImages,
  createProductImage
} from '../controller/productImages.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

router.get('/:id/images', getProductImages);

router.post(
  '/:id/images',
  authMiddleware,
  adminMiddleware,
  createProductImage
);

export default router;