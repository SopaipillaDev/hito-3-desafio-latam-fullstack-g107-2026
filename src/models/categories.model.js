import pool from '../config/db.js';

export const getAllCategories = async () => {
  const query = `
    SELECT id, name, slug, description, created_at, updated_at
    FROM categories
    ORDER BY name ASC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

export const createCategory = async ({ name, slug, description }) => {
  const query = `
    INSERT INTO categories (name, slug, description)
    VALUES ($1, $2, $3)
    RETURNING id, name, slug, description, created_at, updated_at;
  `;

  const values = [name, slug, description];

  const { rows } = await pool.query(query, values);

  return rows[0];
};