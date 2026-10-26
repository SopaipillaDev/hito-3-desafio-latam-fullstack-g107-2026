// Deja pasar solo al administrador. Va siempre DESPUÉS de authMiddleware
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'No tienes permisos para realizar esta acción'
    });
  }

  next();
};
