import { validarDepositoSchema } from "../depositos.schema.js";

export const middlewareValidarDeposito = (req, res, next) => {
  // Le pasamos req.body como datos a nuestro schema para que lo revise
  const resultado = validarDepositoSchema(req.body);

  // Si el schema me dice que no es valido frena aca
  if (!resultado.valido) {
    return res.status(400).json({
      message: "Datos de entrada inválidos",
      errores: resultado.errores,
    });
  }

  // Si esta todo bien, sigue la ejecucion
  next();
};
