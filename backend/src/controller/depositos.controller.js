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

    // Valido que el material exista en el diccionario
    if (!materiales[tipoResiduo]) {
      return res.status(400).json({
        message: `El material ${tipoResiduo} no es valido`,
      });
    }

    const puntosOtorgados =
      pesoIngresado * materiales[tipoResiduo.toLowerCase()];

    // Busco el contenedor en la db segun el Id
    const contenedor = await getContenedorById(contenedorId);

    // Valido que el contenedor exista
    if (!contenedor) {
      return res.status(404).json({
        message: `No se encontró ningún contenedor con el ID ${contenedorId}.`,
      });
    }

    // Valido que el tipo de Residuo ingresado por el usuario sea igual al que admite el contenedor
    if (
      contenedor.tipo_residuo_permitido.toLowerCase() !==
      tipoResiduo.toLowerCase()
    ) {
      return res.status(400).json({
        message: `Material incorrecto, este contenedor solo permite ${contenedor.tipo_residuo_permitido}, pero intentaste depositar ${tipoResiduo}.`,
      });
    }

    // Valido que el contenedor no este lleno
    if (contenedor.estado_llenado === "Lleno") {
      return res.status(400).json({
        message: `El contenedor con el id: ${contenedorId}, se encuentra lleno`,
      });
    }

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

    // Sumo a la carga actual del contendor el peso nuevo ingresado en el deposito por el vecino
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
      message: "Error al registrar el depósito",
      error: error.message,
    });
  }
};
