import * as FavoritesModel from '../models/favorites.model.js';
import * as ProductsModel from '../models/products.model.js';

const crearError = (status, message) =>
{
    const error = new Error(message);
    error.status = status;
    return error;
};

// GET /favorites → favoritos del usuario del token
export const getFavorites = async (req, res, next) =>
{
    try
    {
        const favoritos = await FavoritesModel.getFavorites(req.user.id);
        res.json(favoritos);
    }
    catch (error)
    {
        next(error);
    }
};

// POST /favorites → { product_id }
export const addFavorite = async (req, res, next) =>
{
    try
    {
        const existe = await ProductsModel.existsPublished(req.body.product_id);

        if (!existe)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const favorito = await FavoritesModel.addFavorite(req.user.id, Number(req.body.product_id));
        res.status(201).json(favorito);
    }
    catch (error)
    {
        if (error.code === '23505')
        {
            error.status = 409;
            error.message = 'El producto ya está en tus favoritos';
        }

        next(error);
    }
};

// DELETE /favorites/:product_id → el :product_id es el id del PRODUCTO
export const removeFavorite = async (req, res, next) =>
{
    try
    {
        const productId = Number(req.params.product_id);
        const borrado = Number.isInteger(productId) ? await FavoritesModel.removeFavorite(req.user.id, productId) : null;

        if (!borrado)
        {
            throw crearError(404, 'Ese producto no está en tus favoritos');
        }

        const respuesta =
        {
            message: 'Producto eliminado de favoritos',
            product_id: borrado.product_id
        };
        res.json(respuesta);
    }
    catch (error)
    {
        next(error);
    }
};
