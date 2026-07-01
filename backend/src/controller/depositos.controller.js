import {
  createDepositoResiduo,
  createOrdenRetiro,
  getContenedorById,
  updateContenedorCargaYEstado,
} from "../database/depositosResiduos.js";
// Equivalencias para puntos de materiales
// Los puntos de cada material equivalen a un kg

const materiales = {
  plastico: 10,
  carton: 5,
  vidrio: 15,
  metal: 20,
};

export const registrarDeposito = async (req, res) => {
  try {
    // Recibo los datos enviados desde el front
    const { contenedorId, dniVecino, tipoResiduo, pesoIngresado } = req.body;

    const puntosOtorgados = pesoIngresado * materiales[tipoResiduo];

    // Sumo a la carga actual del contendor el peso nuevo ingresado en el deposito por el vecino
    const contenedor = await getContenedorById(contenedorId);

    const nuevaCarga = contenedor.carga_actual_kg + pesoIngresado;

    const porcentajeMaximo = contenedor.capacidad_maxima_kg * 0.9;

    let nuevoEstado = "Vacante";

    let alertaLleno = false;

    // Separo en casos
    if (nuevaCarga >= porcentajeMaximo) {
      nuevoEstado = "Lleno";
      alertaLleno = true;
    }

    await createDepositoResiduo(
      contenedorId,
      dniVecino,
      pesoIngresado,
      puntosOtorgados,
    );

    await updateContenedorCargaYEstado(nuevaCarga, nuevoEstado, contenedorId);

    if (alertaLleno) {
      await createOrdenRetiro(contenedorId);
    }

    // Si todo salio bien
    res.status(201).json({
      message: "Deposito registrado con exito",
      puntosOtorgados, // Devuelvo los puntos al front
    });
  } catch (error) {
    // Si algo falla, atrapamos el error
    res.status(500).json({
      mensaje: "Error al registrar el depósito",
      error: error.message,
    });
  }
};
