export const validarDepositoSchema = (datos) => {
  const errores = [];

  // Valido que existan los campos obligatorios

  if (!datos.contenedorId) {
    errores.push("El campo contenedorId es obligatorio!");
  }
  if (!datos.dniVecino) {
    errores.push("El campo dniVecino es obligatorio!");
  }
  if (!datos.tipoResiduo) {
    errores.push("El campo tipoResiduo es obligatorio!");
  }
  if (datos.pesoIngresado === undefined) {
    errores.push("El campo pesoIngresado es obligatorio!");
  }

  // Valido tipo de datos y rangos

  if (datos.pesoIngresado <= 0) {
    errores.push("El peso ingresado debe ser mayor a 0");
  }

  return { valido: errores.length === 0, errores };
};
