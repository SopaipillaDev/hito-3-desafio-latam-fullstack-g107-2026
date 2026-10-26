import { Router } from 'express';
import { register, aboutMe } from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', register);
router.get('/me', authMiddleware, aboutMe);

export default router;
