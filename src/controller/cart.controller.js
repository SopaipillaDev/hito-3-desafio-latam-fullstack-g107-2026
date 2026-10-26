import * as CartModel from '../models/cart.model.js';
import * as ProductsModel from '../models/products.model.js';

const crearError = (status, message) =>
{
    const error = new Error(message);
    error.status = status;
    return error;
};

// quantity: entero >= 1 (si no viene, vale 1)
const leerCantidad = (valor) =>
{
    const cantidad = valor === undefined ? 1 : Number(valor);

    if (!Number.isInteger(cantidad) || cantidad < 1)
    {
        throw crearError(400, 'quantity debe ser un entero mayor o igual a 1');
    }

    return cantidad;
};

// GET /cart → { id, items, total } (carrito vacío si aún no tiene)
export const getCart = async (req, res, next) =>
{
    try
    {
        const carrito = await CartModel.getCart(req.user.id);
        res.json(carrito);
    }
    catch (error)
    {
        next(error);
    }
};

// POST /cart/products → { product_id, quantity }
export const addProduct = async (req, res, next) =>
{
    try
    {
        const cantidad = leerCantidad(req.body.quantity);
        const existe = await ProductsModel.existsPublished(req.body.product_id);

        if (!existe)
        {
            throw crearError(404, 'Producto no encontrado');
        }

        const cartId = await CartModel.getOrCreateCartId(req.user.id);
        const item = await CartModel.addProduct(cartId, Number(req.body.product_id), cantidad);
        res.status(201).json(item);
    }
    catch (error)
    {
        if (error.code === '23505')
        {
            error.status = 409;
            error.message = 'El producto ya está en el carrito';
        }

        next(error);
    }
};

// PUT /cart/products/:id → { quantity } (:id es la fila de cart_products)
export const updateQuantity = async (req, res, next) =>
{
    try
    {
        const cantidad = leerCantidad(req.body.quantity);
        const itemId = Number(req.params.id);
        const item = Number.isInteger(itemId) ? await CartModel.updateQuantity(req.user.id, itemId, cantidad) : null;

        if (!item)
        {
            throw crearError(404, 'Producto no encontrado en tu carrito');
        }

        res.json(item);
    }
    catch (error)
    {
        next(error);
    }
};

// DELETE /cart/products/:id
export const removeProduct = async (req, res, next) =>
{
    try
    {
        const itemId = Number(req.params.id);
        const borrado = Number.isInteger(itemId) ? await CartModel.removeProduct(req.user.id, itemId) : null;

        if (!borrado)
        {
            throw crearError(404, 'Producto no encontrado en tu carrito');
        }

        const respuesta =
        {
            message: 'Producto eliminado del carrito',
            id: borrado.id
        };
        res.json(respuesta);
    }
    catch (error)
    {
        next(error);
    }
};
