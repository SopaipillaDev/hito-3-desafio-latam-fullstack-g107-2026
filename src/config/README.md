# 📁 `config/`

## ¿Qué es esta carpeta?

La carpeta `config/` es el lugar donde guardamos la **configuración centralizada** del proyecto. Piensa en ella como el tablero de instrumentos de un auto: aquí se definen los ajustes que el resto del sistema necesita para funcionar correctamente.

## ¿Qué debería ir aquí?

- **Conexión a la base de datos**: credenciales y pool de conexiones con PostgreSQL.
- **Variables de entorno**: lectura de archivos `.env` usando `dotenv`.
- **Configuración de servicios externos**: por ejemplo, claves de API, URLs de servicios, etc.
- **Constantes globales**: puertos, modos de ejecución, tiempos de expiración de tokens, etc.

## ¿Por qué es importante separar la configuración?

Separar la configuración del código de negocio permite:

- Cambiar de entorno (desarrollo, pruebas, producción) sin modificar el código.
- Mantener secretos fuera del control de versiones usando variables de entorno.
- Reutilizar la misma configuración en diferentes partes del proyecto.

## Ejemplo conceptual

```js
// config/db.js
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
```

> **Regla de oro**: si un valor puede cambiar entre ambientes o es sensible, probablemente deba vivir en `config/`.
