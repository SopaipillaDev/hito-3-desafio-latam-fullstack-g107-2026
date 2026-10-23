# 📁 `controller/`

## ¿Qué es esta carpeta?

La carpeta `controller/` contiene los **controladores**, que actúan como los "gerentes" de cada solicitud HTTP. Su trabajo es recibir la petición del cliente, coordinar lo que debe hacerse y devolver una respuesta adecuada.

## Analogía simple

Imagina un restaurante:

- El cliente hace un pedido (petición HTTP).
- El mesero toma el pedido (ruta).
- El **chef** prepara la comida (controlador).
- El mesero lleva la comida al cliente (respuesta HTTP).

El controlador es el cerebro que decide qué ingredientes usar y cómo prepararlos.

## ¿Qué debería ir aquí?

- Funciones que manejan las peticiones HTTP (`req`, `res`).
- Llamadas a los modelos para obtener o guardar datos.
- Aplicación de reglas de negocio básicas.
- Formateo de la respuesta que se enviará al cliente.

## ¿Qué NO debería ir aquí?

- Consultas SQL directas (eso va en `models/`).
- Validaciones de datos (eso va en `validators/`).
- Lógica de autenticación repetida (eso va en `middlewares/`).

## Ejemplo conceptual

```js
// controller/userController.js
import userModel from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
```

> **Regla de oro**: un controlador debe ser delgado. Su función es orquestar, no contener toda la lógica del sistema.
