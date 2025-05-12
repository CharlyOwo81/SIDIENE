// Middleware/validation.js (Reusable)
export const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false, // Return all errors at once
      allowUnknown: false // Reject unknown fields
    });
    
    if (error) {
      const cleanErrors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message.replace(/"/g, '') // Remove quotes
      }));
      return res.status(422).json({ errors: cleanErrors });
    }
    next();
  };