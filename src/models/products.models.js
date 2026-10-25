import pool from '../config/db.js';

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
