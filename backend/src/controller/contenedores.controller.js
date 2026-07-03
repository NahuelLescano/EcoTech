import { pool } from "../database/pool.js";

// Validaciones y funciones auxiliares

const ESTADOS_VALIDOS = ["Vacante", "Lleno"];
const TIPOS_RESIDUO_VALIDOS = ["plastico", "carton", "vidrio", "metal"];

function parseId(idParam) {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function parseEntero(valor) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero < 0) {
    return null;
  }

  return numero;
}

function validarPayloadBase(payload) {
  const { ubicacion_barrio, tipo_residuo_permitido } = payload;

  if (!ubicacion_barrio || !tipo_residuo_permitido) {
    return "ubicacion_barrio y tipo_residuo_permitido son obligatorios";
  }

  return null;
}

function normalizarTipoResiduo(tipoResiduo) {
  if (typeof tipoResiduo !== "string") {
    return null;
  }

  const tipoNormalizado = tipoResiduo.toLowerCase();

  if (!TIPOS_RESIDUO_VALIDOS.includes(tipoNormalizado)) {
    return null;
  }

  return tipoNormalizado;
}

// Get all contenedores

export async function getContenedores(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado FROM ContenedoresHub ORDER BY id ASC",
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener los contenedores",
      error: error.message,
    });
  }
}

// Create contenedor

export async function createContenedor(req, res) {
  const errorValidacion = validarPayloadBase(req.body);

  if (errorValidacion) {
    return res.status(400).json({ message: errorValidacion });
  }

  const capacidadMaximaKg = parseEntero(req.body.capacidad_maxima_kg);
  const cargaActualKg = parseEntero(req.body.carga_actual_kg);

  if (capacidadMaximaKg === null || cargaActualKg === null) {
    return res.status(400).json({
      message:
        "capacidad_maxima_kg y carga_actual_kg deben ser enteros mayores o iguales a 0",
    });
  }

  const tipoResiduoPermitido = normalizarTipoResiduo(
    req.body.tipo_residuo_permitido,
  );

  if (!tipoResiduoPermitido) {
    return res.status(400).json({
      message:
        "tipo_residuo_permitido debe ser uno de: plastico, carton, vidrio o metal",
    });
  }

  if (cargaActualKg > capacidadMaximaKg) {
    return res.status(400).json({
      message: "carga_actual_kg no puede superar capacidad_maxima_kg",
    });
  }

  const estadoLlenado = req.body.estado_llenado || "Vacante";

  if (!ESTADOS_VALIDOS.includes(estadoLlenado)) {
    return res.status(400).json({
      message: "estado_llenado debe ser 'Vacante' o 'Lleno'",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO ContenedoresHub (ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado) VALUES ($1, $2, $3, $4, $5) RETURNING id, ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado",
      [
        req.body.ubicacion_barrio,
        tipoResiduoPermitido,
        capacidadMaximaKg,
        cargaActualKg,
        estadoLlenado,
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el contenedor",
      error: error.message,
    });
  }
}

// Update contenedor

export async function updateContenedor(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "ID de contenedor invalido" });
  }

  const camposPermitidos = {
    ubicacion_barrio: req.body.ubicacion_barrio,
    tipo_residuo_permitido: req.body.tipo_residuo_permitido,
    capacidad_maxima_kg: req.body.capacidad_maxima_kg,
    carga_actual_kg: req.body.carga_actual_kg,
    estado_llenado: req.body.estado_llenado,
  };

  const entradas = Object.entries(camposPermitidos).filter(
    ([, valor]) => valor !== undefined,
  );

  if (entradas.length === 0) {
    return res.status(400).json({ message: "No hay campos para actualizar" });
  }

  const setClauses = [];
  const values = [];

  for (const [campo, valor] of entradas) {
    if (campo === "capacidad_maxima_kg" || campo === "carga_actual_kg") {
      const numero = parseEntero(valor);

      if (numero === null) {
        return res.status(400).json({
          message: `${campo} debe ser un entero mayor o igual a 0`,
        });
      }

      values.push(numero);
    } else if (campo === "estado_llenado") {
      if (!ESTADOS_VALIDOS.includes(valor)) {
        return res.status(400).json({
          message: "estado_llenado debe ser 'Vacante' o 'Lleno'",
        });
      }

      values.push(valor);
    } else {
      values.push(valor);
    }

    setClauses.push(`${campo} = $${values.length}`);
  }

  values.push(id);

  try {
    const result = await pool.query(
      `UPDATE ContenedoresHub SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING id, ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado`,
      values,
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Contenedor no encontrado" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el contenedor",
      error: error.message,
    });
  }
}

// Delete contenedor

export async function deleteContenedor(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "ID de contenedor invalido" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM ContenedoresHub WHERE id = $1 RETURNING id, ubicacion_barrio, tipo_residuo_permitido, capacidad_maxima_kg, carga_actual_kg, estado_llenado",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Contenedor no encontrado" });
    }

    return res.status(200).json({
      message: "Contenedor eliminado",
      contenedor: result.rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error al eliminar el contenedor",
      error: error.message,
    });
  }
}