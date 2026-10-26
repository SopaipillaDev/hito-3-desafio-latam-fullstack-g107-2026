import pool from '../config/db.js';

export const getFavorites = async (userId) =>
{
    const consulta = `
        SELECT f.id, f.created_at,
               json_build_object(
                   'id', p.id,
                   'name', p.name,
                   'slug', p.slug,
                   'price', p.price,
                   'cover_url', (SELECT pi.url FROM product_images pi
                                 WHERE pi.product_id = p.id AND pi.is_cover = TRUE
                                 ORDER BY pi.position LIMIT 1),
                   'rating_avg', (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id)
               ) AS product
        FROM favorites f
        JOIN products p ON p.id = f.product_id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`;
    const { rows } = await pool.query(consulta, [userId]);

    return rows;
};

export const addFavorite = async (userId, productId) =>
{
    const consulta = `
        INSERT INTO favorites (user_id, product_id)
        VALUES ($1, $2)
        RETURNING id, user_id, product_id, created_at`;
    const { rows } = await pool.query(consulta, [userId, productId]);

    return rows[0];
};

export const removeFavorite = async (userId, productId) =>
{
    const consulta = 'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING product_id';
    const { rows } = await pool.query(consulta, [userId, productId]);

    return rows[0] || null;
};
