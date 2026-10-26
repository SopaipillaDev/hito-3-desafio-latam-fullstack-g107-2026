import pool from '../config/db.js';
import { getAllCategories } from './categories.model.js';

/**
 Obtiene productos con filtros opcionales de categoría y búsqueda,
 ordenamiento y paginación.
 */
export const obtenerProductos = async ({ category, search, order_by = 'price_ASC', limit = 12, page = 1 }) => {
  const validOrders = ['price_ASC', 'price_DESC', 'created_at_DESC'];
  if (!validOrders.includes(order_by)) { //Por defecto se ordena por precio ascendente
    order_by = 'price_ASC';
  }
  //paginacion
  const offset = (page - 1) * limit;

  // Si llega un slug de categoría, buscar su ID usando el modelo de categorías
  let categoryId = null;
  if (category) {
    const categorias = await getAllCategories(); // Usa el modelo de categorías 
    const categoriaEncontrada = categorias.find(cat => cat.slug === category);
    if (!categoriaEncontrada) {
      return []; // No existe la categoría, no hay productos
    }
    categoryId = categoriaEncontrada.id;
  }

  let query = "SELECT * FROM products WHERE status = 'published'";
  const queryParams = [];

  // Agregar filtro por category_id (FK a categories.id)
  if (categoryId) {
    query += ' AND category_id = $' + (queryParams.length + 1);
    queryParams.push(categoryId);
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



 //Cuenta el total de productos publicados (para paginación completa)

export const contarProductos = async ({ category, search }) => {
  // Si llega un slug de categoría, buscar su ID usando el modelo de categorías
  let categoryId = null;
  if (category) {
    const categorias = await getAllCategories();
    const categoriaEncontrada = categorias.find(cat => cat.slug === category);
    if (!categoriaEncontrada) {
      return 0; // No existe la categoría, no hay productos
    }
    categoryId = categoriaEncontrada.id;
  }

  let query = 'SELECT COUNT(*) FROM products WHERE status = \'published\'';
  const queryParams = [];

  if (categoryId) {
    query += ' AND category_id = $' + (queryParams.length + 1);
    queryParams.push(categoryId);
  }

  if (search) {
    query += ' AND name ILIKE $' + (queryParams.length + 1);
    queryParams.push(`%${search}%`);
  }

  const { rows } = await pool.query(query, queryParams);
  return rows[0].count;
};


// Obtiene un producto por su ID
 
export const obtenerProductoPorId = async (idProducto) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const values = [idProducto];

  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el producto o undefined si no existe
};


export const crearProducto = async ({ category_id, name, slug, description, price, status }) => {
  // Los valores variables van como parámetros ($1...$6) para evitar inyección SQL
  // NOW() va directo en el SQL porque es una función de Postgres, no un valor del usuario
  const query = `
    INSERT INTO products (category_id, name, slug, description, price, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *;
  `;
  const values = [category_id, name, slug, description, price, status];

  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el producto recién creado
};

/**
 * Actualiza un producto por su ID
 *
 * @param {number} idProducto - ID del producto a actualizar
 * @param {Object} datos - Nuevos datos del producto
 * @returns {Promise<Object|undefined>} - El producto actualizado o undefined si el id no existe
 */
export const actualizarProducto = async (idProducto, { category_id, name, slug, description, price, status }) => {
  // updated_at se regenera con NOW(); created_at no se toca (es la fecha de creación)
  const query = `
    UPDATE products
    SET category_id = $1, name = $2, slug = $3, description = $4, price = $5, status = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;
  const values = [category_id, name, slug, description, price, status, idProducto];

  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el producto actualizado o undefined si el id no existe
};

/**
 * Elimina un producto por su ID
 *
 * @param {number} idProducto - ID del producto a eliminar
 * @returns {Promise<Object|undefined>} - El producto eliminado o undefined si no existía
 */
export const eliminarProducto = async (idProducto) => {
  // RETURNING * permite saber si se eliminó algo (si no, rows viene vacío)
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *;';
  const values = [idProducto];

  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna el producto eliminado o undefined si no existía
};