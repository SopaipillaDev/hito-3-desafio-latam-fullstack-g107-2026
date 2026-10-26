import pool from '../config/db.js';

// Busca el carrito del usuario; si no existe, lo crea (un carrito por usuario)
export const getOrCreateCartId = async (userId) =>
{
    const consulta = `
        INSERT INTO carts (user_id) VALUES ($1)
        ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
        RETURNING id`;
    const { rows } = await pool.query(consulta, [userId]);

    return rows[0].id;
};

export const getCart = async (userId) =>
{
    const { rows: carritos } = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);

    if (carritos.length === 0)
    {
        const vacio =
        {
            id: null,
            items: [],
            total: 0
        };
        return vacio;
    }

    const consulta = `
        SELECT cp.id, cp.product_id, p.name,
               (SELECT pi.url FROM product_images pi
                WHERE pi.product_id = p.id AND pi.is_cover = TRUE
                ORDER BY pi.position LIMIT 1) AS cover_url,
               cp.quantity, cp.unit_price,
               cp.quantity * cp.unit_price AS subtotal
        FROM cart_products cp
        JOIN products p ON p.id = cp.product_id
        WHERE cp.cart_id = $1
        ORDER BY cp.id`;
    const { rows: items } = await pool.query(consulta, [carritos[0].id]);

    const carrito =
    {
        id: carritos[0].id,
        items,
        total: items.reduce((suma, item) => suma + item.subtotal, 0)
    };
    return carrito;
};

// unit_price lo pone el servidor desde products.price (nunca desde el front)
export const addProduct = async (cartId, productId, quantity) =>
{
    const consulta = `
        INSERT INTO cart_products (cart_id, product_id, quantity, unit_price)
        SELECT $1, p.id, $3, p.price FROM products p WHERE p.id = $2
        RETURNING id, cart_id, product_id, quantity, unit_price`;
    const { rows } = await pool.query(consulta, [cartId, productId, quantity]);

    return rows[0];
};

// Solo modifica filas del carrito del usuario del token
export const updateQuantity = async (userId, itemId, quantity) =>
{
    const consulta = `
        UPDATE cart_products cp
        SET quantity = $1
        FROM carts c
        WHERE cp.id = $2 AND cp.cart_id = c.id AND c.user_id = $3
        RETURNING cp.id, cp.cart_id, cp.product_id, cp.quantity, cp.unit_price`;
    const { rows } = await pool.query(consulta, [quantity, itemId, userId]);

    return rows[0] || null;
};

export const removeProduct = async (userId, itemId) =>
{
    const consulta = `
        DELETE FROM cart_products cp
        USING carts c
        WHERE cp.id = $1 AND cp.cart_id = c.id AND c.user_id = $2
        RETURNING cp.id`;
    const { rows } = await pool.query(consulta, [itemId, userId]);

    return rows[0] || null;
};
