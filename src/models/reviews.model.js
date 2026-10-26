import pool from '../config/db.js';

export const getReviewsByProduct = async (productId) =>
{
    const consulta = `
        SELECT r.id, r.rating, r.comment, r.created_at,
               json_build_object('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) AS user
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC`;
    const { rows } = await pool.query(consulta, [productId]);

    return rows;
};

export const createReview = async ({ productId, userId, rating, comment }) =>
{
    const consulta = `
        INSERT INTO reviews (product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING id, product_id, user_id, rating, comment, created_at`;
    const { rows } = await pool.query(consulta, [productId, userId, rating, comment || null]);

    return rows[0];
};
