import { Router } from 'express';
import {
  getCategories,
  createCategory
} from '../controller/category.controller.js';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);

export default router;