import {
  completarOrdenRetiro,
  createOrdenRetiro,
  deleteOrdenRetiro,
  despacharOrdenRetiro,
  getOrdenPendienteByContenedorId,
  getOrdenRetiroById,
  getOrdenesPendientes,
  getOrdenesRetiro,
  updateOrdenRetiro,
} from "../database/ordenesRetiro.js";
import { getContenedorById } from "../database/depositosResiduos.js";

const normalizarBodyOrden = (body) => ({
  contenedorId: Number(body.contenedorId ?? body.contenedor_id),
  empresaRecolectora: body.empresaRecolectora ?? body.empresa_recolectora,
  patenteCamion: body.patenteCamion ?? body.patente_camion,
  fechaProgramada: body.fechaProgramada ?? body.fecha_programada,
});

export const listarOrdenes = async (_req, res) => {
  try {
    const ordenes = await getOrdenesRetiro();
    res.json({ ordenes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes de retiro" });
  }
};

export const listarOrdenesPendientes = async (_req, res) => {
  try {
    const ordenes = await getOrdenesPendientes();
    res.json({ ordenes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes pendientes" });
  }
};

export const programarOrdenRetiro = async (req, res) => {
  const { contenedorId, empresaRecolectora, patenteCamion, fechaProgramada } = normalizarBodyOrden(req.body);

  try {
    const contenedor = await getContenedorById(contenedorId);
    if (!contenedor) {
      return res.status(404).json({ message: `No se encontró ningún contenedor con el ID ${contenedorId}.` });
    }

    const ordenPendiente = await getOrdenPendienteByContenedorId(contenedorId);
    if (ordenPendiente) {
      const ordenActualizada = await updateOrdenRetiro(ordenPendiente.id, {
        empresaRecolectora,
        patenteCamion,
        fechaProgramada,
      });

      return res.json({
        message: "Orden de retiro actualizada correctamente",
        orden: ordenActualizada,
      });
    }

    const ordenCreada = await createOrdenRetiro({
      contenedorId,
      empresaRecolectora,
      patenteCamion,
      fechaProgramada,
    });

    res.status(201).json({
      message: "Orden de retiro programada correctamente",
      orden: ordenCreada,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al programar la orden de retiro" });
  }
};

export const actualizarOrdenRetiro = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "ID de orden inválido" });
    return;
  }

  const { empresaRecolectora, patenteCamion, fechaProgramada } = normalizarBodyOrden(req.body);

  try {
    const orden = await getOrdenRetiroById(id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const ordenActualizada = await updateOrdenRetiro(id, {
      empresaRecolectora,
      patenteCamion,
      fechaProgramada,
    });

    res.json({
      message: "Orden actualizada correctamente",
      orden: ordenActualizada,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden" });
  }
};

export const eliminarOrdenRetiro = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "ID de orden inválido" });
    return;
  }

  try {
    const ordenEliminada = await deleteOrdenRetiro(id);
    if (!ordenEliminada) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({ message: "Orden eliminada correctamente", ordenId: ordenEliminada.id });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden" });
  }
};

export const completarOrden = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
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

export const despacharOrden = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "ID de orden inválido" });
    return;
  }

  const resultado = await despacharOrdenRetiro(id);
  if (!resultado) {
    res.status(404).json({ message: "Orden no encontrada o ya esta completa" });
    return;
  }

  res.json({ message: `Orden #${resultado.ordenId} despachada. Contenedor #${resultado.contenedorId} vaciado.` });
}
