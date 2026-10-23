# 📁 `models/`

## ¿Qué es esta carpeta?

La carpeta `models/` contiene todo lo relacionado con el **acceso a datos**. Aquí vive la lógica que se comunica directamente con la base de datos.

## Analogía simple

Imagina una biblioteca:

- El controlador es el bibliotecario que recibe tu solicitud.
- El modelo es la persona que va al almacén, busca el libro y te lo trae.

El modelo conoce **dónde y cómo** están guardados los datos.

## ¿Qué debería ir aquí?

- Consultas SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
- Conexión con la base de datos a través del pool de conexiones.
- Funciones que representan entidades del sistema: usuarios, productos, pedidos, etc.
- Mapeo de filas de la base de datos a objetos de JavaScript.

## ¿Qué NO debería ir aquí?

- Lógica de negocio compleja (eso va en los controladores).
- Validación de datos de entrada (eso va en `validators/`).
- Respuestas HTTP directas (eso va en los controladores).

## Ejemplo conceptual

```js
// models/userModel.js
import db from '../config/db.js';

export const findAll = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

export const findById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};
```

> **Regla de oro**: los modelos son la única capa que debería saber cómo está estructurada la base de datos.
