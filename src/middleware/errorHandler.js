export const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    const response = {
      success: false,
      error: err.message || 'Error interno del servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
  
    res.status(statusCode).json(response);
  };