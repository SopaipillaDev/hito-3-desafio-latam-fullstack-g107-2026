import { Router } from 'express';
import { obtenerProductos, obtenerProductoId } from '../controller/products.controller.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoId);


export default router;