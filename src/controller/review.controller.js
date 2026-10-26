import * as ReviewsModel from '../models/reviews.model.js';
import * as ProductsModel from '../models/products.model.js';

const crearError = (status, message) =>
{
    const error = new Error(message);
    error.status = status;
    return error;
};

// GET /products/:id/reviews → reseñas del producto (público)
export const getReviews = async (req, res, next) =>
{
    try
    {
        const existe = await ProductsModel.existsPublished(req.params.id);

        if (!existe)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const reviews = await ReviewsModel.getReviewsByProduct(Number(req.params.id));
        res.json(reviews);
    }
    catch (error)
    {
        next(error);
    }
};

// POST /products/:id/reviews → crea la reseña del usuario del token
export const createReview = async (req, res, next) =>
{
    try
    {
        const rating = Number(req.body.rating);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5)
        {
            throw crearError(400, 'rating debe ser un entero entre 1 y 5');
        }

        const existe = await ProductsModel.existsPublished(req.params.id);

        if (!existe)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const datos =
        {
            productId: Number(req.params.id),
            userId: req.user.id,
            rating,
            comment: req.body.comment
        };
        const review = await ReviewsModel.createReview(datos);
        res.status(201).json(review);
    }
    catch (error)
    {
        if (error.code === '23505')
        {
            error.status = 409;
            error.message = 'Ya dejaste una reseña para este producto';
        }

        next(error);
    }
};
