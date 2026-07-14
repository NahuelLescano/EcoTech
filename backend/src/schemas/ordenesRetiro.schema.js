export const validarOrdenRetiroSchema = (datos) => {
  const errores = [];
  const fechaProgramada = datos.fechaProgramada ?? datos.fecha_programada;
  const contenedorId = datos.contenedorId ?? datos.contenedor_id;
  const empresaRecolectora = datos.empresaRecolectora ?? datos.empresa_recolectora;
  const patenteCamion = datos.patenteCamion ?? datos.patente_camion;
  const formatoFechaValido = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!contenedorId) {
    errores.push("El campo contenedorId es obligatorio!");
  }
  if (!empresaRecolectora) {
    errores.push("El campo empresaRecolectora es obligatorio!");
  }
  if (!patenteCamion) {
    errores.push("El campo patenteCamion es obligatorio!");
  }
  if (!fechaProgramada) {
    errores.push("El campo fechaProgramada es obligatorio!");
  }

  if (contenedorId !== undefined && (!Number.isInteger(Number(contenedorId)) || Number(contenedorId) <= 0)) {
    errores.push("El campo contenedorId debe ser un entero mayor a 0");
  }

  if (empresaRecolectora && empresaRecolectora.length > 100) {
    errores.push("El campo empresaRecolectora no puede superar los 100 caracteres");
  }

  if (patenteCamion && patenteCamion.length > 20) {
    errores.push("El campo patenteCamion no puede superar los 20 caracteres");
  }

  if (fechaProgramada && !formatoFechaValido.test(fechaProgramada)) {
    errores.push("La fecha programada debe tener el formato DD/MM/AAAA");
  }

  return { valido: errores.length === 0, errores };
};