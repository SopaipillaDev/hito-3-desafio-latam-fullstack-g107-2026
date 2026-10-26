import pool from '../config/db.js';

export const ESTADOS = ['pending', 'paid', 'rejected', 'cancelled'];

export const getOrders = async ({ status, limit, page }) =>
{
    const valores = [];
    let where = '';

    if (status)
    {
        valores.push(status);
        where = `WHERE o.status = $${valores.length}`;
    }

    const { rows: filasTotal } = await pool.query(`SELECT COUNT(*) AS total FROM orders o ${where}`, valores);

    const consulta = `
        SELECT o.id,
               json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS user,
               o.total, o.status, o.created_at
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ${where}
        ORDER BY o.created_at DESC, o.id DESC
        LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`;
    const { rows } = await pool.query(consulta, [...valores, limit, (page - 1) * limit]);

    const resultado =
    {
        total: Number(filasTotal[0].total),
        results: rows
    };
    return resultado;
};

// Métricas: solo cuentan las órdenes pagadas
export const getStats = async () =>
{
    const consultaVentas = `
        SELECT COALESCE(SUM(total), 0) AS total_sales, COUNT(*) AS orders_paid
        FROM orders
        WHERE status = 'paid'`;
    const { rows: ventas } = await pool.query(consultaVentas);

    const { rows: usuarios } = await pool.query("SELECT COUNT(*) AS users FROM users WHERE role = 'user'");

    const consultaTop = `
        SELECT p.id, p.name, SUM(op.quantity) AS units_sold
        FROM order_products op
        JOIN orders o   ON o.id = op.order_id AND o.status = 'paid'
        JOIN products p ON p.id = op.product_id
        GROUP BY p.id
        ORDER BY units_sold DESC, p.id
        LIMIT 5`;
    const { rows: top } = await pool.query(consultaTop);

    const metricas =
    {
        total_sales: Number(ventas[0].total_sales),
        orders_paid: Number(ventas[0].orders_paid),
        users: Number(usuarios[0].users),
        top_products: top.map((producto) =>
        {
            const fila =
            {
                ...producto,
                units_sold: Number(producto.units_sold)
            };
            return fila;
        })
    };
    return metricas;
};
