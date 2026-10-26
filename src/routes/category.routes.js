import { Router } from 'express';
import {
  getCategories,
  createCategory
} from '../controller/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authMiddleware, adminMiddleware, createCategory);

export default router;