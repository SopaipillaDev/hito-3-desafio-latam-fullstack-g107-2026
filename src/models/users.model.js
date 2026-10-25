import pool from '../config/db.js';

export const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
};

export const createUser = async ({ name, email, password, avatar_url }) => {
  const query = `
    INSERT INTO users (name, email, password_hash, avatar_url)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, avatar_url, role, created_at
  `;
  const values = [name, email, password, avatar_url || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const userMe = async (idUser) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [idUser]
  const {rows} = await pool.query(query, values);
  console.log('Consultaaaaaaaa')
  console.log(rows[0])
  return rows[0];
}

//campo es el nombre de la columna de la base de datos por la que se ordenará la consutla.
//status puede ser craft o published
export const productos = async(status, campo, direccion,limits,offset) =>{
  const formattedQuery = format(
    "SELECT * FROM products WHERE status = '%s' ORDER BY %s %s LIMIT %s OFFSET %s", 
    status, campo, direccion, limits, offset
  )
  const {rows}=await pool.query(query);
  return rows[0];
}
