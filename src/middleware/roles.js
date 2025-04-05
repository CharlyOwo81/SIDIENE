export const checkRole = (requiredRole) => (req, res, next) => {
    if (req.user.rol.toLowerCase() !== requiredRole.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado. Se requiere rol de ${requiredRole}`
      });
    }
    next();
  };