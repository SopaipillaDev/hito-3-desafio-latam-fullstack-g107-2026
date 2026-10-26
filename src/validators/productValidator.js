// Revisa los datos de un producto antes de guardarlo (POST y PUT /products)

export const validateProduct = ({ category_id, name, slug, price, status }) =>
{
    const errors = [];

    if (!Number.isInteger(Number(category_id)) || Number(category_id) <= 0)
    {
        errors.push('category_id es obligatorio.');
    }

    if (!name || String(name).trim() === '')
    {
        errors.push('El nombre es obligatorio.');
    }

    if (!slug || String(slug).trim() === '')
    {
        errors.push('El slug es obligatorio.');
    }

    if (!Number.isInteger(Number(price)) || Number(price) <= 0)
    {
        errors.push('price debe ser un número entero mayor a 0.');
    }

    if (status && !['draft', 'published'].includes(status))
    {
        errors.push('status debe ser draft o published.');
    }

    return errors;
};
