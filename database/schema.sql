-- ============================================================
-- MarketGaming · Hito 3 · Estructura de la base de datos (PostgreSQL)
-- Basado en el schema.sql del Hito 1 (Documento 2 · Base de datos).
-- Solo el administrador publica productos; todos los productos son
-- digitales; precios INTEGER en CLP.
--
-- Supabase: pegar completo en SQL Editor → New query → Run.
-- PostgreSQL local: psql -U postgres -d marketgaming -f schema.sql
--
-- CUIDADO: la primera instrucción BORRA las 11 tablas y sus datos.
-- Correrlo de nuevo solo avisando al equipo.
-- Los datos de prueba están en seed.sql (se corre después de este).
-- ============================================================

DROP TABLE IF EXISTS favorites, reviews, order_products, orders, cart_products, carts,
  product_files, product_images, products, categories, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER      NOT NULL REFERENCES categories(id),
  name        VARCHAR(150) NOT NULL,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  price       INTEGER      NOT NULL CHECK (price > 0),   -- CLP sin decimales
  status      VARCHAR(10)  NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
  -- sin stock: productos digitales · sin seller_id: solo el administrador publica
);

CREATE TABLE product_images (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT    NOT NULL,                               -- dirección de la imagen, no la imagen
  alt_text   VARCHAR(150),
  is_cover   BOOLEAN NOT NULL DEFAULT FALSE,
  position   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE product_files (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_url   TEXT         NOT NULL,
  file_name  VARCHAR(150) NOT NULL,
  file_size  INTEGER                              -- bytes, opcional
);

CREATE TABLE carts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER   NOT NULL UNIQUE REFERENCES users(id),   -- 1 carrito por usuario
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_products (
  id         SERIAL PRIMARY KEY,
  cart_id    INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  unit_price INTEGER NOT NULL,
  UNIQUE (cart_id, product_id)
);

CREATE TABLE orders (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER     NOT NULL REFERENCES users(id),
  total             INTEGER     NOT NULL,
  status            VARCHAR(10) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'rejected', 'cancelled')),
  payment_reference VARCHAR(100),                               -- código de la transacción
  created_at        TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE order_products (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),         -- sin cascade: no se pierde el historial
  quantity   INTEGER NOT NULL CHECK (quantity >= 1),
  unit_price INTEGER NOT NULL,                                  -- precio congelado al comprar
  subtotal   INTEGER NOT NULL
);

CREATE TABLE reviews (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    INTEGER   NOT NULL REFERENCES users(id),           -- autor de la reseña
  rating     INTEGER   NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)                                  -- 1 reseña por producto
);

CREATE TABLE favorites (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)                                  -- 1 favorito por producto
);
