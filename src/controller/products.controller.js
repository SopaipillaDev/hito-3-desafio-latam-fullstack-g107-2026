import * as ProductsModel from '../models/products.models.js';


export const obtenerProductos = async (req, res) => {
  // 1. Obtener parámetros de query con valores por defecto
  const category = req.query.category || null; // Slug de categoría
  const search = req.query.search || null; // Texto a buscar en el nombre
  const order_by = req.query.order_by || 'price_ASC'; // Orden: price_ASC, price_DESC o created_at_DESC
  const limit = parseInt(req.query.limit) || 12; // Productos por página, por defecto 12
  const page = parseInt(req.query.page) || 1; // Número de página, por defecto 1

  // 2. Llamar al modelo para obtener productos con paginación y filtros
  const productos = await ProductsModel.obtenerProductos({ category, search, order_by, limit, page });

  // 3. Obtener el total para metadata de paginación
  const total = await ProductsModel.contarProductos({ category, search });

  // 4. Responder con los datos
  res.json({
    success: true,
    data: productos,
    pagination: {
      page,
      limit,
      total, // Total de registros que coinciden con los filtros
      totalPages: Math.ceil(total / limit), // Total de páginas
    },
  });
};

export const obtenerProductoId = async (req, res) => {
const { id } = req.params;
// Llamar al modelo para buscar el producto por id
  const producto = await ProductsModel.obtenerProductoPorId(id);

  //Si no existe el producto, responder 404
  if (!producto) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado',
    });
  }

  //Responde con el producto
  res.json({
    success: true,
    data: producto,
  });
};

export const nuevoProducto = async (req, res) => {
  // 1. Extraer los datos del body
  const { category_id, name, slug, description, price, status } = req.body;

  // 2. Validar los campos obligatorios
  if (!category_id || !name || !slug || !price || !status) {
    return res.status(400).json({
      success: false,
      error: 'category_id, name, slug, price y status son obligatorios',
    });
  }

  // 3. Llamar al modelo para crear el producto
  const producto = await ProductsModel.crearProducto({ category_id, name, slug, description, price, status });

  // 4. Responder con el producto creado (201 = Created)
  res.status(201).json({
    success: true,
    data: producto,
  });
};

export const editarProducto = async (req, res) => {
  // 1. Obtener el id de la ruta (PUT /products/5 → req.params.id)
  const { id } = req.params;

  // 2. Extraer los datos del body
  const { category_id, name, slug, description, price, status } = req.body;

  // 3. Validar los campos obligatorios
  if (!category_id || !name || !slug || !price || !status) {
    return res.status(400).json({
      success: false,
      error: 'category_id, name, slug, price y status son obligatorios',
    });
  }

  // 4. Llamar al modelo para actualizar el producto
  const producto = await ProductsModel.actualizarProducto(id, { category_id, name, slug, description, price, status });

  // 5. Si ningún registro coincidió con el id, responder 404
  if (!producto) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado',
    });
  }

  // 6. Responder con el producto actualizado
  res.json({
    success: true,
    data: producto,
  });
};

export const borrarProducto = async (req, res) => {
  // 1. Obtener el id de la ruta (DELETE /products/5 → req.params.id)
  const { id } = req.params;

  // 2. Llamar al modelo para eliminar el producto
  const producto = await ProductsModel.eliminarProducto(id);

  // 3. Si ningún registro coincidió con el id, responder 404
  if (!producto) {
    return res.status(404).json({
      success: false,
      error: 'Producto no encontrado',
    });
  }

  // 4. Confirmar la eliminación
  res.json({
    success: true,
    message: 'Producto eliminado',
  });
};