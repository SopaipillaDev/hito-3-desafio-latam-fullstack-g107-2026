import pool from '../config/db.js';

/**
 * Obtiene productos con filtros opcionales de categoría y búsqueda,
 * ordenamiento y paginación.
 * 
 * @param {Object} params - Parámetros de consulta
 * @param {string} [params.category] - Slug de categoría (opcional)
 * @param {string} [params.search] - Texto a buscar en el nombre (opcional)
 * @param {string} [params.order_by='price_ASC'] - Orden: price_ASC, price_DESC, created_at_DESC
 * @param {number} [params.limit=12] - Productos por página
 * @param {number} [params.page=1] - Número de página
 * @returns {Promise<Array>} - Lista de productos
 */
export const ObtenerProductos = async ({ category, search, order_by = 'price_ASC', limit = 12, page = 1 }) => {
  const validOrders = ['price_ASC', 'price_DESC', 'created_at_DESC'];
  if (!validOrders.includes(order_by)) { //Por defecto se ordena por precio ascendente
    order_by = 'price_ASC';
  }
  //paginacion
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM products WHERE status = 'published'";
  const queryParams = [];

  // Agregar filtro de categoría (slug)
  if (category) {
    query += ' AND category = $' + (queryParams.length + 1); //Agrega un siguiente numero de elemento al arreglo
    queryParams.push(category); //Inserta la categoria en el arrglo de queryParams
  }

  // Agregar filtro de búsqueda en nombre (ILIKE = búsqueda insensible a mayúsculas/minúsculas)
  if (search) {
    query += ' AND name ILIKE $' + (queryParams.length + 1);
    queryParams.push(`%${search}%`);
  }

  // Mapear order_by a sintaxis SQL
  const orderMap = {
    price_ASC: 'price ASC',
    price_DESC: 'price DESC',
    created_at_DESC: 'created_at DESC',
  };

  // Agregar ORDER BY
  query += ` ORDER BY ${orderMap[order_by]}`; //orderMap busca el params y devuelve el formato correcto para la consulta

  // Agregar LIMIT y OFFSET (cantidad de registros omitidos o saltados antes de traer los datos de la consulta)
  const paramIndex = queryParams.length + 1;  //Agrega un siguiente numero de elemento al arreglo
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);

  // Ejecutar query
  const { rows } = await pool.query(query, queryParams);

  return rows;
};

/**
 * Cuenta el total de productos publicados (para paginación completa)
 * 
 * @param {Object} params - Parámetros de filtro
 * @param {string} [params.category] - Slug de categoría (opcional)
 * @param {string} [params.search] - Texto a buscar en el nombre (opcional)
 * @returns {Promise<number>} - Total de registros
 */
export const ContarProductos = async ({ category, search }) => {
  let query = 'SELECT COUNT(*) FROM products WHERE status = \'published\'';
  const queryParams = [];

  if (category) {
    query += ' AND category = $' + (queryParams.length + 1);
    queryParams.push(category);
  }

  if (search) {
    query += ' AND name ILIKE $' + (queryParams.length + 1);
    queryParams.push(`%${search}%`);
  }

  const { rows } = await pool.query(query, queryParams);
  return rows[0].count;
};