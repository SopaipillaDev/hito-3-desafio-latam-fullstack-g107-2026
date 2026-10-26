# MarketGaming Backend

Backend de la aplicación **MarketGaming**, desarrollado con **Node.js** y **Express** como parte del hito 3 del bootcamp Full Stack de Desafío Latam.

Este servidor expone una API REST que se conecta a una base de datos **PostgreSQL** y gestiona autenticación de usuarios, catálogo, carrito, órdenes y administración de un marketplace de cursos y guías para aprender a desarrollar videojuegos.

El proyecto utiliza **módulos ES** (`import` / `export`), configurados con `"type": "module"` en `package.json`.

---

## Tecnologías principales

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (cliente `pg`)
- [JSON Web Tokens](https://jwt.io/) (`jsonwebtoken`)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) para hashing de contraseñas
- [CORS](https://www.npmjs.com/package/cors) para habilitar solicitudes entre dominios
- [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) para pruebas
- [Nodemon](https://www.npmjs.com/package/nodemon) para recarga automática en desarrollo

---

## Requisitos previos

- Node.js instalado
- Base de datos PostgreSQL (Supabase o local), creada con los scripts de `database/`
- Variables de entorno configuradas (ver `.env.example`)

---

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=postgres
JWT_SECRET=
```

Puedes copiar la plantilla incluida:

```bash
cp .env.example .env
```

## Uso

### Modo desarrollo

```bash
npm run dev
```

Inicia el servidor con `nodemon`, que reinicia automáticamente ante cambios en el código.

### Modo producción

```bash
node index.js
```

### Ejecutar pruebas

```bash
npm test
```

---

## Estructura del proyecto

```
.
├── index.js              # Punto de entrada del servidor
├── src/
│   ├── app.js            # Configuración principal de Express
│   ├── config/           # Configuración de base de datos y entorno
│   ├── controller/       # Controladores: lógica de negocio de cada recurso
│   ├── middlewares/      # Middlewares personalizados (autenticación, manejo de errores, etc.)
│   ├── models/           # Modelos y consultas a la base de datos
│   ├── routes/           # Definición de rutas de la API
│   └── validators/       # Validación de datos de entrada
├── .env.example          # Plantilla de variables de entorno
├── package.json          # Dependencias y scripts del proyecto
└── README.md             # Este archivo
```

### Descripción de carpetas

| Carpeta / Archivo | Función |
| ----------------- | ------- |
| `index.js` | Punto de entrada de la aplicación. Carga las variables de entorno y levanta el servidor en el puerto configurado. |
| `src/app.js` | Configura la instancia de Express con los middlewares globales (`cors`, `express.json`) y exporta la aplicación para poder ser usada en pruebas. |
| `src/config/` | Contiene archivos de configuración, como la conexión a PostgreSQL y la carga de variables de entorno. |
| `src/controller/` | Agrupa los controladores. Cada controlador recibe las peticiones HTTP, ejecuta la lógica de negocio y devuelve las respuestas correspondientes. |
| `src/middlewares/` | Middlewares reutilizables, por ejemplo para verificar tokens JWT, manejar errores o registrar peticiones. |
| `src/models/` | Encapsula el acceso a la base de datos: consultas SQL, creación de tablas y operaciones CRUD. |
| `src/routes/` | Define los endpoints de la API y los asocia con sus respectivos controladores. |
| `src/validators/` | Valida los datos que llegan en las peticiones antes de que lleguen a los controladores. |

---

## Scripts disponibles

| Script | Descripción |
| ------ | ----------- |
| `npm start` | Inicia el servidor en modo producción con Node. |
| `npm run dev` | Inicia el servidor en modo desarrollo con Nodemon (recarga automática). |
| `npm test` | Ejecuta la suite de pruebas con Jest y Supertest. |

---

## Convenciones

- Se usan **módulos ES**: `import` / `export` en lugar de `require` / `module.exports`.
- Las importaciones relativas deben incluir la extensión del archivo (`.js`).

## Base de datos

1. Crear la base en Supabase (SQL Editor) o en PostgreSQL local.
2. Ejecutar `database/schema.sql` (crea las 11 tablas) y luego `database/seed.sql` (datos de prueba).
3. En `.env`: con Supabase usar `DB_SSL=true`; con PostgreSQL local, `DB_SSL=false`.

> `schema.sql` y `seed.sql` **borran los datos** antes de crear o insertar. Córranlos solo avisando al equipo.

## Cuentas de prueba

| Rol | Email | Contraseña |
| --- | ----- | ---------- |
| Administrador | admin@marketgaming.cl | admin123 |
| Cliente | ana.rojas@email.cl | 123456 |

Los otros clientes del seed (diego.munoz, camila.silva y benjamin.torres, todos `@email.cl`) también usan `123456`.

## Endpoints

| Método | Ruta | Acceso |
| ------ | ---- | ------ |
| POST | /users | Público |
| POST | /login | Público |
| GET | /users/me | Usuario |
| GET | /categories | Público |
| POST | /categories | Admin |
| GET | /products | Público (filtros: category, search, order_by, limit, page) |
| GET | /products/:id | Público |
| POST | /products | Admin |
| PUT | /products/:id | Admin |
| DELETE | /products/:id | Admin |
| GET | /products/:id/images | Público |
| POST | /products/:id/images | Admin |
| POST | /products/:id/files | Admin |
| GET | /products/:id/reviews | Público |
| POST | /products/:id/reviews | Usuario |
| GET | /favorites | Usuario |
| POST | /favorites | Usuario |
| DELETE | /favorites/:product_id | Usuario |
| GET | /cart | Usuario |
| POST | /cart/products | Usuario |
| PUT | /cart/products/:id | Usuario |
| DELETE | /cart/products/:id | Usuario |
| POST | /orders | Usuario |
| GET | /orders | Usuario |
| GET | /orders/:id | Usuario (dueño) o Admin |
| POST | /orders/:id/payment | Usuario (pago simulado) |
| GET | /orders/:id/files | Usuario (orden pagada) |
| GET | /admin/orders | Admin |
| GET | /admin/stats | Admin |

"Usuario" significa que la ruta pide el header `Authorization: Bearer <token>` que entrega `POST /login`.

## Rúbrica del Hito 3

| Requerimiento | Dónde está |
| ------------- | ---------- |
| 1. Proyecto npm y dependencias | `package.json` |
| 2. Paquete pg | `src/config/db.js` y `src/models/` |
| 3. Autenticación y autorización con JWT | `src/controller/user.controller.js` (firma), `src/middlewares/auth.middleware.js` (verifica), `src/middlewares/admin.middleware.js` (rol) |
| 4. CORS | `src/app.js` |
| 5. Middlewares con next | `src/middlewares/auth.middleware.js` y `src/middlewares/admin.middleware.js` |
| 6. Tests | `tests/api.spec.js` (`npm test`) |

---

## Licencia

ISC
