# 📁 `routes/`

## ¿Qué es esta carpeta?

La carpeta `routes/` define el **mapa de direcciones** de la API. Aquí se especifican las URLs disponibles, los métodos HTTP permitidos y qué controlador se encarga de atender cada petición.

## Analogía simple

Imagina una ciudad:

- Las rutas son las calles y avenidas.
- Cada dirección lleva a un lugar específico.
- El letrero indica qué controlador atiende esa dirección.

Las rutas no procesan la lógica, solo **dirigen el tráfico**.

## ¿Qué debería ir aquí?

- Definición de endpoints (`/users`, `/products`, `/orders`, etc.).
- Asignación de métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`).
- Aplicación de middlewares específicos a ciertas rutas.
- Conexión entre la URL y el controlador correspondiente.

## ¿Qué NO debería ir aquí?

- Lógica de negocio (eso va en `controllers/`).
- Consultas a la base de datos (eso va en `models/`).
- Validaciones detalladas (eso va en `validators/`), aunque sí se pueden aplicar aquí.

## Ejemplo conceptual

```js
// routes/userRoutes.js
import express from 'express';
import userController from '../controller/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

export default router;
```

> **Regla de oro**: las rutas solo deben definir **a dónde** llega la petición y **quién** la atiende.
