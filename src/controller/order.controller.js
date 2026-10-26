import * as OrdersModel from '../models/orders.model.js';

const crearError = (status, message) =>
{
    const error = new Error(message);
    error.status = status;
    return error;
};

// Busca la orden y revisa que sea del usuario del token (o que sea admin)
const buscarOrdenPropia = async (req, permitirAdmin) =>
{
    const orderId = Number(req.params.id);
    const orden = Number.isInteger(orderId) ? await OrdersModel.getOrderById(orderId) : null;

    if (!orden)
    {
        throw crearError(404, 'Orden no encontrada');
    }

    const esDueno = orden.user_id === req.user.id;
    const esAdmin = permitirAdmin && req.user.role === 'admin';

    if (!esDueno && !esAdmin)
    {
        throw crearError(403, 'Esta orden no te pertenece');
    }

    return orden;
};

// POST /orders → { items: [{ product_id, quantity }] }
export const createOrder = async (req, res, next) =>
{
    try
    {
        const items = req.body.items;

        if (!Array.isArray(items) || items.length === 0)
        {
            throw crearError(400, 'items debe ser una lista con al menos un producto');
        }

        for (const item of items)
        {
            const cantidad = Number(item.quantity ?? 1);

            if (!Number.isInteger(Number(item.product_id)) || !Number.isInteger(cantidad) || cantidad < 1)
            {
                throw crearError(400, 'Cada item necesita product_id y una quantity entera mayor o igual a 1');
            }
        }

        const ids = items.map((item) => Number(item.product_id));
        const productos = await OrdersModel.getPublishedProducts(ids);

        // El precio sale de la base de datos, nunca del frontend
        const lineas = items.map((item) =>
        {
            const producto = productos.find((p) => p.id === Number(item.product_id));

            if (!producto)
            {
                throw crearError(404, 'Producto no encontrado');
            }

            const cantidad = Number(item.quantity ?? 1);
            const linea =
            {
                product_id: producto.id,
                name: producto.name,
                quantity: cantidad,
                unit_price: producto.price,
                subtotal: producto.price * cantidad
            };
            return linea;
        });

        const total = lineas.reduce((suma, linea) => suma + linea.subtotal, 0);
        const orden = await OrdersModel.createOrder(req.user.id, total, lineas);

        const respuesta =
        {
            ...orden,
            items: lineas
        };
        res.status(201).json(respuesta);
    }
    catch (error)
    {
        next(error);
    }
};

// POST /orders/:id/payment → { result: "approved" | "rejected" } (pago simulado)
export const payOrder = async (req, res, next) =>
{
    try
    {
        const orden = await buscarOrdenPropia(req, false);

        if (orden.status === 'paid')
        {
            throw crearError(409, 'La orden ya fue pagada');
        }

        if (orden.status === 'cancelled')
        {
            throw crearError(409, 'La orden fue cancelada');
        }

        if (req.body.result === 'rejected')
        {
            await OrdersModel.updateStatus(orden.id, 'rejected', null);

            const rechazado =
            {
                order_id: orden.id,
                status: 'rejected',
                payment_reference: null,
                message: 'El pago fue rechazado. Intenta nuevamente'
            };
            return res.json(rechazado);
        }

        // Referencia simulada: SIM-AAAAMMDD-0042
        const fecha = new Date().toISOString().slice(0, 10).replaceAll('-', '');
        const referencia = `SIM-${fecha}-${String(orden.id).padStart(4, '0')}`;
        const pagada = await OrdersModel.updateStatus(orden.id, 'paid', referencia);
        await OrdersModel.removePaidProductsFromCart(req.user.id, orden.id);

        const aprobado =
        {
            order_id: pagada.id,
            status: pagada.status,
            payment_reference: pagada.payment_reference,
            paid_at: pagada.updated_at
        };
        res.json(aprobado);
    }
    catch (error)
    {
        next(error);
    }
};

// GET /orders → mis compras
export const getMyOrders = async (req, res, next) =>
{
    try
    {
        const ordenes = await OrdersModel.getOrdersByUser(req.user.id);
        res.json(ordenes);
    }
    catch (error)
    {
        next(error);
    }
};

// GET /orders/:id → detalle (dueño o admin)
export const getOrderById = async (req, res, next) =>
{
    try
    {
        const orden = await buscarOrdenPropia(req, true);
        const items = await OrdersModel.getOrderItems(orden.id);

        const detalle =
        {
            id: orden.id,
            user: orden.user,
            total: orden.total,
            status: orden.status,
            payment_reference: orden.payment_reference,
            created_at: orden.created_at,
            items
        };
        res.json(detalle);
    }
    catch (error)
    {
        next(error);
    }
};

// GET /orders/:id/files → archivos, solo si la orden es tuya y está pagada
export const getOrderFiles = async (req, res, next) =>
{
    try
    {
        const orderId = Number(req.params.id);
        const orden = Number.isInteger(orderId) ? await OrdersModel.getOrderById(orderId) : null;

        if (!orden)
        {
            throw crearError(404, 'Orden no encontrada');
        }

        if (orden.user_id !== req.user.id || orden.status !== 'paid')
        {
            throw crearError(403, 'La orden no está pagada o no te pertenece');
        }

        const archivos = await OrdersModel.getOrderFiles(orden.id);
        res.json(archivos);
    }
    catch (error)
    {
        next(error);
    }
};
