import { createDepositoResiduo } from "../database/depositosResiduos.js";
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

    const created = await createDepositoResiduo(
      contenedorId,
      dniVecino,
      pesoIngresado,
      puntosOtorgados,
    );

    // Si todo salio bien
    res.status(201).json({ message: "Deposito registrado" });
  } catch (error) {
    // Si algo falla, atrapamos el error
    res.status(500).json({
      mensaje: "Error al registrar el depósito",
      error: error.message,
    });
  }
};
