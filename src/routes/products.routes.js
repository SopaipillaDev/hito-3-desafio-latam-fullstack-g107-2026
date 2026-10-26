import { Router } from 'express';
import { obtenerProductos, obtenerProductoId, nuevoProducto, editarProducto, borrarProducto } from '../controller/products.controller.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoId);
router.post('/', nuevoProducto);
router.put('/:id', editarProducto);
router.delete('/:id', borrarProducto);

export default router;