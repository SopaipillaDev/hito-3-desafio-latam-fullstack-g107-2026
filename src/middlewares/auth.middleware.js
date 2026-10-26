import jwt from 'jsonwebtoken';

// Revisa el token del header Authorization: "Bearer <token>"
export const authMiddleware = (req, res, next) =>
{
    const authorization = req.header('Authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : null;

    if (!token)
    {
        return res.status(401).json({ message: 'Token inválido o ausente' });
    }

    let usuario;

    try
    {
        usuario = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error)
    {
        return res.status(401).json({ message: 'Token inválido o ausente' });
    }

    req.user = usuario;   // { id, email, role }
    next();
};
