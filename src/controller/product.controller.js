import * as ProductsModel from '../models/products.model.js';
import { validateProduct } from '../validators/productValidator.js';

// Crea un error con su código HTTP (lo responde el manejador de app.js)
const crearError = (status, message) =>
{
    const error = new Error(message);
    error.status = status;
    return error;
};

// Traduce los errores de PostgreSQL más comunes a códigos HTTP
const traducirErrorSQL = (error) =>
{
    if (error.code === '23505')
    {
        error.status = 409;
        error.message = 'Ya existe un producto con ese slug.';
    }

    if (error.code === '23503')
    {
        error.status = 400;
        error.message = 'La categoría no existe.';
    }

    return error;
};

// GET /products → { total, page, limit, total_pages, results }
export const getProducts = async (req, res, next) =>
{
    try
    {
        const { category, search, order_by } = req.query;

        if (order_by && !ProductsModel.ORDENES[order_by])
        {
            throw crearError(400, 'order_by no válido. Usa price_ASC, price_DESC o created_at_DESC');
        }

        const limit = Math.min(Math.max(Math.floor(Number(req.query.limit)) || 12, 1), 50);
        const page = Math.max(Math.floor(Number(req.query.page)) || 1, 1);

        const { total, results } = await ProductsModel.getProducts({ category, search, order_by, limit, page });

        const respuesta =
        {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
            results
        };
        res.json(respuesta);
    }
    catch (error)
    {
        next(error);
    }
};

// GET /products/:id → producto con sus imágenes, o 404
export const getProductById = async (req, res, next) =>
{
    try
    {
        const id = Number(req.params.id);
        const producto = Number.isInteger(id) ? await ProductsModel.getProductById(id) : null;

        if (!producto)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        res.json(producto);
    }
    catch (error)
    {
        next(error);
    }
};

// POST /products → 201 con el producto creado (solo admin)
export const createProduct = async (req, res, next) =>
{
    try
    {
        const errors = validateProduct(req.body);

        if (errors.length > 0)
        {
            throw crearError(400, errors.join(' '));
        }

        const producto = await ProductsModel.createProduct(req.body);
        res.status(201).json(producto);
    }
    catch (error)
    {
        next(traducirErrorSQL(error));
    }
};

// PUT /products/:id → reemplaza el producto completo (solo admin)
export const updateProduct = async (req, res, next) =>
{
    try
    {
        const id = Number(req.params.id);

        if (!Number.isInteger(id))
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const errors = validateProduct(req.body);

        if (errors.length > 0)
        {
            throw crearError(400, errors.join(' '));
        }

        const producto = await ProductsModel.updateProduct(id, req.body);

        if (!producto)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        res.json(producto);
    }
    catch (error)
    {
        next(traducirErrorSQL(error));
    }
};

// DELETE /products/:id → 200, o 409 si ya tiene compras (se pasa a draft)
export const deleteProduct = async (req, res, next) =>
{
    try
    {
        const id = Number(req.params.id);
        const borrado = Number.isInteger(id) ? await ProductsModel.deleteProduct(id) : null;

        if (!borrado)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const respuesta =
        {
            message: 'Producto eliminado',
            id: borrado.id
        };
        res.json(respuesta);
    }
    catch (error)
    {
        if (error.code === '23503')
        {
            error.status = 409;
            error.message = 'El producto tiene compras asociadas. Cámbialo a borrador (draft)';
        }

        next(error);
    }
};
