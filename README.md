# MarketGaming Backend

Backend de la aplicación **MarketGaming**, desarrollado con **Node.js** y **Express** como parte del hito 3 del bootcamp Full Stack de Desafío Latam.

Este servidor expone una API REST que se conecta a una base de datos **PostgreSQL** y gestiona funcionalidades como autenticación de usuarios, productos y transacciones del marketplace de videojuegos.

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
- PostgreSQL en ejecución
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

## Estado actual

> **Nota:** Este backend se encuentra en etapa inicial. La instancia de Express ya está configurada en `src/app.js` y la estructura de carpetas está definida. Aún están pendientes las implementaciones de rutas, controladores, modelos, middlewares y validadores.

---

## Licencia

ISC
