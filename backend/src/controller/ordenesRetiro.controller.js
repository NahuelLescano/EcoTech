import { completarOrdenRetiro, getOrdenesPendientes } from "../database/ordenesRetiro.js";

export const listarOrdenesPendientes = async (_req, res) => {
  try {
    const ordenes = await getOrdenesPendientes();
    res.json({ ordenes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes pendientes" });
  }
};

export const completarOrden = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id < 0) {
    res.status(400).json({ message: "ID de orden inválido" });
    return;
  }

  try {
    const result = await completarOrdenRetiro(id);
    if (!result) {
      res.status(404).json({ message: "Orden no encontrada o ya completada" });
      return;
    }

    res.json({ message: "Orden completada exitosamente", ordenId: result.ordenId, contenedorId: result.contenedorId });
  } catch (error) {
    res.status(500).json({ message: "Error al completar la orden" });
  }
};
