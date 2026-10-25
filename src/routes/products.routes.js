import { Router } from 'express';
import { obtenerProductos } from '../controller/products.controller.js';

const router = Router();

router.get('/', obtenerProductos);


export default router;