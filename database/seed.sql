-- ============================================================
-- MarketGaming · Hito 3 · Datos de prueba (seed)
-- Se corre DESPUÉS de schema.sql. Llena las 11 tablas con datos
-- coherentes entre sí: cursos y guías PDF para aprender a crear
-- videojuegos (Hito 1), con las categorías que usa el frontend.
--
-- Supabase: pegar completo en SQL Editor → New query → Run.
-- PostgreSQL local: psql -U postgres -d marketgaming -f seed.sql
--
-- CUIDADO: el TRUNCATE BORRA todos los datos antes de insertar.
-- Correrlo de nuevo solo avisando al equipo.
--
-- Cuentas de prueba (no son secretas):
--   admin@marketgaming.cl  / admin123  (administrador)
--   los otros 4 correos    / 123456    (clientes)
-- ============================================================

-- pgcrypto aporta crypt() y gen_salt(): pican contraseñas con bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vacía todas las tablas y reinicia los contadores de id
TRUNCATE TABLE
    users, categories, carts, orders, products,
    cart_products, order_products, reviews, product_images,
    favorites, product_files
RESTART IDENTITY CASCADE;

-- ------------------------------------------------------------
-- USERS: 1 administrador y 4 clientes
-- crypt(clave, gen_salt('bf', 10)) = bcrypt con costo 10 (sin comillas)
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, avatar_url, role) VALUES
    (1, 'Micah Guzmán',    'admin@marketgaming.cl',    crypt('admin123', gen_salt('bf', 10)), NULL,                              'admin'),
    (2, 'Ana Rojas',       'ana.rojas@email.cl',       crypt('123456',   gen_salt('bf', 10)), 'https://i.pravatar.cc/150?img=1', 'user'),
    (3, 'Diego Muñoz',     'diego.munoz@email.cl',     crypt('123456',   gen_salt('bf', 10)), 'https://i.pravatar.cc/150?img=2', 'user'),
    (4, 'Camila Silva',    'camila.silva@email.cl',    crypt('123456',   gen_salt('bf', 10)), NULL,                              'user'),
    (5, 'Benjamín Torres', 'benjamin.torres@email.cl', crypt('123456',   gen_salt('bf', 10)), 'https://i.pravatar.cc/150?img=3', 'user');

-- ------------------------------------------------------------
-- CATEGORIES: los 4 slugs que filtra la Galería del frontend
-- ------------------------------------------------------------
INSERT INTO categories (id, name, slug, description) VALUES
    (1, 'Unity',         'unity',         'Cursos y guías para crear juegos con Unity'),
    (2, 'Unreal Engine', 'unreal-engine', 'Cursos y guías para crear juegos con Unreal Engine'),
    (3, 'Programación',  'programacion',  'Fundamentos de programación aplicados a videojuegos'),
    (4, 'Arte y Diseño', 'arte-y-diseno', 'Arte 2D, pixel art y diseño de videojuegos');

-- ------------------------------------------------------------
-- PRODUCTS: 8 productos digitales (6 publicados y 2 borradores)
-- price en CLP, siempre mayor a 0
-- ------------------------------------------------------------
INSERT INTO products (id, category_id, name, slug, description, price, status) VALUES
    (1, 1, 'Unity desde cero',                    'unity-desde-cero',             'Curso en video para crear tu primer juego 2D en Unity.',            29990, 'published'),
    (2, 2, 'Unreal Engine 5: tu primer nivel',    'unreal-engine-5-primer-nivel', 'Curso para construir un nivel jugable con Blueprints.',             45990, 'published'),
    (3, 3, 'C# para videojuegos',                 'csharp-para-videojuegos',      'Curso de fundamentos de programación aplicados a juegos.',          34990, 'published'),
    (4, 4, 'Guía PDF de pixel art',               'guia-pdf-pixel-art',           'Guía descargable con ejercicios de pixel art paso a paso.',          9990, 'published'),
    (5, 4, 'Diseño de niveles: guía práctica',    'diseno-de-niveles-guia',       'Guía PDF con principios y plantillas para diseñar niveles.',        25990, 'published'),
    (6, 1, 'Unity: juegos en 3D',                 'unity-juegos-3d',              'Curso de física, cámaras e iluminación en Unity.',                  19990, 'draft'),
    (7, 3, 'Patrones de programación para juegos','patrones-programacion-juegos', 'Curso sobre máquinas de estado, eventos y componentes.',            39990, 'published'),
    (8, 2, 'Unreal: materiales y shaders',        'unreal-materiales-shaders',    'Guía PDF sobre materiales en Unreal Engine.',                        7990, 'draft');

-- ------------------------------------------------------------
-- CARTS: 1 carrito por usuario (user_id es UNIQUE)
-- ------------------------------------------------------------
INSERT INTO carts (id, user_id) VALUES
    (1, 2),
    (2, 3);

-- ------------------------------------------------------------
-- CART_PRODUCTS: productos dentro de cada carrito
-- ------------------------------------------------------------
INSERT INTO cart_products (id, cart_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 1, 29990),
    (2, 1, 4, 2,  9990),
    (3, 2, 2, 1, 45990);

-- ------------------------------------------------------------
-- ORDERS: 5 órdenes, una por cada estado posible
-- total = suma de los subtotales de sus productos
-- ------------------------------------------------------------
INSERT INTO orders (id, user_id, total, status, payment_reference) VALUES
    (1, 2, 49970, 'paid',      'PAY-1001'),
    (2, 3, 45990, 'paid',      'PAY-1002'),
    (3, 4, 34990, 'pending',   NULL),
    (4, 5, 25990, 'rejected',  NULL),
    (5, 2, 39990, 'cancelled', NULL);

-- ------------------------------------------------------------
-- ORDER_PRODUCTS: detalle de cada orden
-- unit_price y subtotal congelan el precio al momento de comprar
-- ------------------------------------------------------------
INSERT INTO order_products (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
    (1, 1, 1, 1, 29990, 29990),
    (2, 1, 4, 2,  9990, 19980),
    (3, 2, 2, 1, 45990, 45990),
    (4, 3, 3, 1, 34990, 34990),
    (5, 4, 5, 1, 25990, 25990),
    (6, 5, 7, 1, 39990, 39990);

-- ------------------------------------------------------------
-- REVIEWS: rating de 1 a 5, una reseña por usuario y producto
-- ------------------------------------------------------------
INSERT INTO reviews (id, product_id, user_id, rating, comment) VALUES
    (1, 1, 2, 5, 'Excelente curso, terminé mi primer juego en una semana.'),
    (2, 4, 2, 4, 'Guía clara y con buenos ejercicios.'),
    (3, 2, 3, 5, 'El mejor curso de Unreal que he tomado.'),
    (4, 3, 4, 4, 'Muy buena base, aunque faltan más ejemplos avanzados.'),
    (5, 5, 5, 3, 'Útil, pero la curva de aprendizaje es empinada.'),
    (6, 1, 3, 4, 'Explicaciones simples y proyectos entretenidos.');

-- ------------------------------------------------------------
-- PRODUCT_IMAGES: la base guarda la DIRECCIÓN (URL) de la imagen.
-- Por ahora, imágenes de relleno de placehold.co (sí cargan).
-- Cambiarlas por las URL de Supabase Storage cuando suban las reales.
-- ------------------------------------------------------------
INSERT INTO product_images (id, product_id, url, alt_text, is_cover, position) VALUES
    (1, 1, 'https://placehold.co/600x400?text=Unity+desde+cero',          'Portada de Unity desde cero',                    TRUE,  1),
    (2, 1, 'https://placehold.co/600x400?text=Unity+captura',             'Captura del proyecto del curso',                 FALSE, 2),
    (3, 2, 'https://placehold.co/600x400?text=Unreal+Engine+5',           'Portada de Unreal Engine 5: tu primer nivel',    TRUE,  1),
    (4, 3, 'https://placehold.co/600x400?text=C%23+para+videojuegos',     'Portada de C# para videojuegos',                 TRUE,  1),
    (5, 4, 'https://placehold.co/600x400?text=Pixel+art',                 'Portada de Guía PDF de pixel art',               TRUE,  1),
    (6, 5, 'https://placehold.co/600x400?text=Diseno+de+niveles',         'Portada de Diseño de niveles: guía práctica',    TRUE,  1),
    (7, 7, 'https://placehold.co/600x400?text=Patrones+de+programacion',  'Portada de Patrones de programación para juegos', TRUE, 1);

-- ------------------------------------------------------------
-- FAVORITES: un favorito por usuario y producto
-- ------------------------------------------------------------
INSERT INTO favorites (id, user_id, product_id) VALUES
    (1, 2, 2),
    (2, 3, 1),
    (3, 4, 2),
    (4, 5, 7),
    (5, 2, 5);

-- ------------------------------------------------------------
-- PRODUCT_FILES: archivo descargable de cada producto (URL)
-- Direcciones de ejemplo; cambiarlas cuando suban los archivos reales.
-- file_size en bytes (5242880 = 5 MB)
-- ------------------------------------------------------------
INSERT INTO product_files (id, product_id, file_url, file_name, file_size) VALUES
    (1, 1, 'https://ejemplo.cl/files/unity-desde-cero-guia.pdf',          'unity-desde-cero-guia.pdf',          5242880),
    (2, 1, 'https://ejemplo.cl/files/unity-desde-cero-proyecto.zip',      'unity-desde-cero-proyecto.zip',     52428800),
    (3, 2, 'https://ejemplo.cl/files/unreal-primer-nivel-guia.pdf',       'unreal-primer-nivel-guia.pdf',       6291456),
    (4, 3, 'https://ejemplo.cl/files/csharp-para-videojuegos.pdf',        'csharp-para-videojuegos.pdf',        4194304),
    (5, 4, 'https://ejemplo.cl/files/guia-pixel-art.pdf',                 'guia-pixel-art.pdf',                 8388608),
    (6, 5, 'https://ejemplo.cl/files/diseno-de-niveles.pdf',              'diseno-de-niveles.pdf',              3145728),
    (7, 7, 'https://ejemplo.cl/files/patrones-programacion-juegos.pdf',   'patrones-programacion-juegos.pdf',   4718592);

-- ------------------------------------------------------------
-- Ajusta los contadores para que los próximos id sigan después
-- de los datos insertados a mano
-- ------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('users', 'id'),          (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('categories', 'id'),     (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('carts', 'id'),          (SELECT MAX(id) FROM carts));
SELECT setval(pg_get_serial_sequence('orders', 'id'),         (SELECT MAX(id) FROM orders));
SELECT setval(pg_get_serial_sequence('products', 'id'),       (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('cart_products', 'id'),  (SELECT MAX(id) FROM cart_products));
SELECT setval(pg_get_serial_sequence('order_products', 'id'), (SELECT MAX(id) FROM order_products));
SELECT setval(pg_get_serial_sequence('reviews', 'id'),        (SELECT MAX(id) FROM reviews));
SELECT setval(pg_get_serial_sequence('product_images', 'id'), (SELECT MAX(id) FROM product_images));
SELECT setval(pg_get_serial_sequence('favorites', 'id'),      (SELECT MAX(id) FROM favorites));
SELECT setval(pg_get_serial_sequence('product_files', 'id'),  (SELECT MAX(id) FROM product_files));
