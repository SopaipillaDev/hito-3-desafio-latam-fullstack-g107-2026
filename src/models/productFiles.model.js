import pool from '../config/db.js';

export const productExists = async (productId) => {
  const query = `
    SELECT id
    FROM products
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [productId]);

  return rows.length > 0;
};

export const createProductFile = async ({
  productId,
  file_url,
  file_name,
  file_size
}) => {
  const query = `
    INSERT INTO product_files (
      product_id,
      file_url,
      file_name,
      file_size
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, product_id, file_url, file_name, file_size;
  `;

  const values = [
    productId,
    file_url,
    file_name,
    file_size
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};