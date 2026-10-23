import { Router } from 'express';
import { register, login } from '../controller/user.controller.js';

const router = Router();


router.post('/', register);
router.post('/login', login);

export default router;