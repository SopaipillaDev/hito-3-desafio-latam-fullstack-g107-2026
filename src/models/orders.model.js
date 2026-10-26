import pool from '../config/db.js';

// Precios actuales de los productos pedidos (solo publicados)
export const getPublishedProducts = async (ids) =>
{
    const consulta = "SELECT id, name, price FROM products WHERE id = ANY($1::int[]) AND status = 'published'";
    const { rows } = await pool.query(consulta, [ids]);

    return rows;
};

// Crea la orden y sus líneas en una TRANSACCIÓN: se guardan las dos cosas o ninguna
export const createOrder = async (userId, total, lineas) =>
{
    const cliente = await pool.connect();

    try
    {
        await cliente.query('BEGIN');

        const consultaOrden = `
            INSERT INTO orders (user_id, total, status)
            VALUES ($1, $2, 'pending')
            RETURNING id, user_id, total, status, created_at`;
        const { rows } = await cliente.query(consultaOrden, [userId, total]);
        const orden = rows[0];

        for (const linea of lineas)
        {
            const consultaLinea = `
                INSERT INTO order_products (order_id, product_id, quantity, unit_price, subtotal)
                VALUES ($1, $2, $3, $4, $5)`;
            await cliente.query(consultaLinea, [orden.id, linea.product_id, linea.quantity, linea.unit_price, linea.subtotal]);
        }

        await cliente.query('COMMIT');
        return orden;
    }
    catch (error)
    {
        await cliente.query('ROLLBACK');
        throw error;
    }
    finally
    {
        cliente.release();
    }
};

export const getOrderById = async (orderId) =>
{
    const consulta = `
        SELECT o.id, o.user_id, o.total, o.status, o.payment_reference, o.created_at, o.updated_at,
               json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS user
        FROM orders o
        JOIN users u ON u.id = o.user_id
        WHERE o.id = $1`;
    const { rows } = await pool.query(consulta, [orderId]);

    return rows[0] || null;
};

export const getOrderItems = async (orderId) =>
{
    const consulta = `
        SELECT op.product_id, p.name, op.quantity, op.unit_price, op.subtotal
        FROM order_products op
        JOIN products p ON p.id = op.product_id
        WHERE op.order_id = $1
        ORDER BY op.id`;
    const { rows } = await pool.query(consulta, [orderId]);

    return rows;
};

export const getOrdersByUser = async (userId) =>
{
    const consulta = `
        SELECT o.id, o.total, o.status, o.created_at, COUNT(op.id) AS items_count
        FROM orders o
        LEFT JOIN order_products op ON op.order_id = o.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`;
    const { rows } = await pool.query(consulta, [userId]);

    return rows.map((orden) =>
    {
        const resultado =
        {
            ...orden,
            items_count: Number(orden.items_count)
        };
        return resultado;
    });
};

export const updateStatus = async (orderId, status, paymentReference) =>
{
    const consulta = `
        UPDATE orders
        SET status = $1, payment_reference = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, status, payment_reference, updated_at`;
    const { rows } = await pool.query(consulta, [status, paymentReference, orderId]);

    return rows[0];
};

// Después de pagar: saca del carrito los productos que se compraron
export const removePaidProductsFromCart = async (userId, orderId) =>
{
    const consulta = `
        DELETE FROM cart_products cp
        USING carts c
        WHERE cp.cart_id = c.id AND c.user_id = $1
          AND cp.product_id IN (SELECT product_id FROM order_products WHERE order_id = $2)`;
    await pool.query(consulta, [userId, orderId]);
};

export const getOrderFiles = async (orderId) =>
{
    const consulta = `
        SELECT op.product_id, p.name AS product_name, pf.file_name, pf.file_url, pf.file_size
        FROM order_products op
        JOIN products p       ON p.id = op.product_id
        JOIN product_files pf ON pf.product_id = op.product_id
        WHERE op.order_id = $1
        ORDER BY op.product_id, pf.id`;
    const { rows } = await pool.query(consulta, [orderId]);

    return rows;
};
