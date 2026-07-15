import { validarOrdenRetiroSchema } from "../ordenesRetiro.schema.js";

export const middlewareValidarOrdenRetiro = (req, res, next) => {
  const resultado = validarOrdenRetiroSchema(req.body);

  if (!resultado.valido) {
    return res.status(400).json({
      message: "Datos de entrada inválidos",
      errores: resultado.errores,
    });
  }

  next();
};