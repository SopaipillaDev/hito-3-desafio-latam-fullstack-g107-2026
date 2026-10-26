import * as AdminModel from '../models/admin.model.js';

// GET /admin/orders → todas las órdenes, con filtro de status y paginación
export const getOrders = async (req, res, next) =>
{
    try
    {
        const { status } = req.query;

        if (status && !AdminModel.ESTADOS.includes(status))
        {
            const error = new Error('status no válido. Usa pending, paid, rejected o cancelled');
            error.status = 400;
            throw error;
        }

        const limit = Math.min(Math.max(Math.floor(Number(req.query.limit)) || 20, 1), 100);
        const page = Math.max(Math.floor(Number(req.query.page)) || 1, 1);

        const { total, results } = await AdminModel.getOrders({ status, limit, page });

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

// GET /admin/stats → métricas del dashboard
export const getStats = async (req, res, next) =>
{
    try
    {
        const metricas = await AdminModel.getStats();
        res.json(metricas);
    }
    catch (error)
    {
        next(error);
    }
};
