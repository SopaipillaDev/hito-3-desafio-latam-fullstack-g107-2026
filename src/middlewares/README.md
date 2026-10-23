# 📁 `middlewares/`

## ¿Qué es esta carpeta?

La carpeta `middlewares/` contiene funciones que se ejecutan **en medio** del flujo de una petición HTTP. Su nombre lo dice: están en el "medio" entre la llegada de la solicitud y la respuesta final.

## Analogía simple

Imagina que entras a un edificio:

- Primero pasas por seguridad, quien revisa tu identificación.
- Luego el ascensor te lleva a tu piso.
- Finalmente llegas a tu destino.

Los **middlewares** son como la seguridad del edificio: revisan, filtran o preparan algo antes de dejar pasar la petición.

## ¿Qué debería ir aquí?

- **Autenticación**: verificar si el usuario tiene un token JWT válido.
- **Autorización**: comprobar si el usuario tiene permisos para realizar una acción.
- **Manejo de errores**: capturar errores y devolver respuestas amigables.
- **Logging**: registrar las peticiones que llegan al servidor.
- **CORS**: configurar políticas de acceso entre dominios.

## ¿Por qué son útiles?

Permiten reutilizar lógica común en muchas rutas sin repetir código. Si varias rutas necesitan validar un token, se crea un solo middleware y se aplica donde se necesite.

## Ejemplo conceptual

```js
// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Continúa con la siguiente función
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

export default verifyToken;
```

> **Regla de oro**: si una acción debe repetirse en varias rutas antes o después de procesar la petición, es candidata a ser un middleware.
