import { Router } from 'express';
import { register, login, aboutMe } from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

console.log('entro a la ruta')

router.post('/', register);
router.post('/login', login);
router.get('/me', authMiddleware, aboutMe); 

export default router;