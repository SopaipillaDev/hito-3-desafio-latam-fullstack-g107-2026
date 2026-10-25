import pool from '../config/db.js';

export const getImagesByProductId = async (productId) => {
  const query = `
    SELECT id, product_id, url, alt_text, is_cover, position
    FROM product_images
    WHERE product_id = $1
    ORDER BY position ASC;
  `;

  const { rows } = await pool.query(query, [productId]);

  return rows;
};

export const createProductImage = async ({
  productId,
  url,
  alt_text,
  is_cover,
  position
}) => {
  const query = `
    INSERT INTO product_images (
      product_id,
      url,
      alt_text,
      is_cover,
      position
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, product_id, url, alt_text, is_cover, position;
  `;

  const values = [
    productId,
    url,
    alt_text,
    is_cover,
    position
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const productExists = async (productId) => {
  const query = `
    SELECT id
    FROM products
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [productId]);

  return rows.length > 0;
};