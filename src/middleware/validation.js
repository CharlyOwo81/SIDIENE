import Joi from 'joi';

export const validateStudent = (req, res, next) => {
  const schema = Joi.object({
    curp: Joi.string().length(18).required(),
    nombres: Joi.string().required(),
    apellido_paterno: Joi.string().required(),
    apellido_materno: Joi.string().required(),
    grado: Joi.string().valid('1', '2', '3').required(),
    grupo: Joi.string().max(2).required(),
    anio_ingreso: Joi.number().min(2000).max(new Date().getFullYear()).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};