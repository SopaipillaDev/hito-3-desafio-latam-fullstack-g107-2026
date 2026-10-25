import { Router } from 'express';
import { register, login, aboutMe } from '../controller/user.controller.js';

const router = Router();


router.post('/', register);
router.post('/login', login);
router.get('/me',aboutMe); 

export default router;