import { Router } from 'express';
import { createProductFile } from '../controller/productFiles.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

router.post(
  '/:id/files',
  authMiddleware,
  adminMiddleware,
  createProductFile
);

export default router;