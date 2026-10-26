import pool from '../config/db.js';

// Lista cerrada: ORDER BY no acepta $1, por eso solo se aceptan estas opciones
export const ORDENES =
{
    price_ASC: 'p.price ASC',
    price_DESC: 'p.price DESC',
    created_at_DESC: 'p.created_at DESC'
};

// Portada: una sola imagen con is_cover = TRUE (la de menor position)
const PORTADA = `(SELECT pi.url FROM product_images pi
                  WHERE pi.product_id = p.id AND pi.is_cover = TRUE
                  ORDER BY pi.position LIMIT 1)`;

// pg entrega AVG y COUNT como texto: aquí se convierten a número
const aNumeros = (producto) =>
{
    const resultado =
    {
        ...producto,
        rating_avg: producto.rating_avg === null ? null : Number(producto.rating_avg),
        reviews_count: Number(producto.reviews_count)
    };
    return resultado;
};

// Arma el WHERE con $1, $2... según los filtros que lleguen
const construirFiltros = ({ category, search }) =>
{
    const condiciones = ["p.status = 'published'"];
    const valores = [];

    if (category)
    {
        valores.push(category);
        condiciones.push(`c.slug = $${valores.length}`);
    }

    if (search)
    {
        valores.push(`%${search}%`);
        condiciones.push(`p.name ILIKE $${valores.length}`);
    }

    const filtros =
    {
        where: condiciones.join(' AND '),
        valores
    };
    return filtros;
};

export const getProducts = async ({ category, search, order_by, limit, page }) =>
{
    const { where, valores } = construirFiltros({ category, search });
    const orden = ORDENES[order_by] || ORDENES.created_at_DESC;
    const offset = (page - 1) * limit;

    const consultaTotal = `
        SELECT COUNT(*) AS total
        FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE ${where}`;
    const { rows: filasTotal } = await pool.query(consultaTotal, valores);

    const consulta = `
        SELECT p.id, p.name, p.slug, p.price, p.status,
               ${PORTADA} AS cover_url,
               json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS category,
               ROUND(AVG(r.rating), 1) AS rating_avg,
               COUNT(r.id) AS reviews_count
        FROM products p
        JOIN categories c   ON c.id = p.category_id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE ${where}
        GROUP BY p.id, c.id
        ORDER BY ${orden}
        LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`;
    const { rows } = await pool.query(consulta, [...valores, limit, offset]);

    const resultado =
    {
        total: Number(filasTotal[0].total),
        results: rows.map(aNumeros)
    };
    return resultado;
};

export const getProductById = async (id) =>
{
    const consulta = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.status,
               json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS category,
               ROUND(AVG(r.rating), 1) AS rating_avg,
               COUNT(r.id) AS reviews_count,
               p.created_at, p.updated_at
        FROM products p
        JOIN categories c   ON c.id = p.category_id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.id = $1 AND p.status = 'published'
        GROUP BY p.id, c.id`;
    const { rows } = await pool.query(consulta, [id]);

    if (rows.length === 0)
    {
        return null;
    }

    const consultaImagenes = `
        SELECT id, url, alt_text, is_cover, position
        FROM product_images
        WHERE product_id = $1
        ORDER BY position`;
    const { rows: images } = await pool.query(consultaImagenes, [id]);

    const producto =
    {
        ...aNumeros(rows[0]),
        images
    };
    return producto;
};

// ¿Existe y está publicado? Lo usan reseñas, favoritos, carrito y órdenes
export const existsPublished = async (id) =>
{
    if (!Number.isInteger(Number(id)))
    {
        return false;
    }

    const { rows } = await pool.query("SELECT id FROM products WHERE id = $1 AND status = 'published'", [id]);
    return rows.length > 0;
};

export const createProduct = async ({ category_id, name, slug, description, price, status }) =>
{
    const consulta = `
        INSERT INTO products (category_id, name, slug, description, price, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, category_id, name, slug, description, price, status, created_at, updated_at`;
    const valores = [category_id, name, slug, description || null, price, status || 'draft'];
    const { rows } = await pool.query(consulta, valores);

    return rows[0];
};

export const updateProduct = async (id, { category_id, name, slug, description, price, status }) =>
{
    const consulta = `
        UPDATE products
        SET category_id = $1, name = $2, slug = $3, description = $4, price = $5, status = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING id, category_id, name, slug, description, price, status, created_at, updated_at`;
    const valores = [category_id, name, slug, description || null, price, status || 'draft', id];
    const { rows } = await pool.query(consulta, valores);

    return rows[0] || null;
};

export const deleteProduct = async (id) =>
{
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return rows[0] || null;
};
