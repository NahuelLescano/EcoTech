import { pool } from "./pool.js";

const selectOrdenes = `
  SELECT o.id, o.contenedor_id, o.empresa_recolectora, o.patente_camion,
         o.fecha_programada, o.estado_orden,
         c.ubicacion_barrio, c.tipo_residuo_permitido,
         c.capacidad_maxima_kg, c.carga_actual_kg
    FROM OrdenesRetiros o
    JOIN ContenedoresHub c ON o.contenedor_id = c.id
`;

const formatearFechaActual = (fecha = new Date()) => {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
};

export async function getOrdenesRetiro() {
  const res = await pool.query(`${selectOrdenes} ORDER BY o.id ASC`);
  return res.rows;
}

export async function getOrdenesPendientes() {
  const res = await pool.query(
    `${selectOrdenes} WHERE o.estado_orden = 'Pendiente' ORDER BY o.id ASC`,
  );
  return res.rows;
}

export async function getOrdenRetiroById(ordenId) {
  const res = await pool.query(`${selectOrdenes} WHERE o.id = $1 LIMIT 1`, [ordenId]);
  return res.rows[0] ?? null;
}

export async function getOrdenPendienteByContenedorId(contenedorId) {
  const res = await pool.query(
    `${selectOrdenes} WHERE o.contenedor_id = $1 AND o.estado_orden = 'Pendiente' LIMIT 1`,
    [contenedorId],
  );
  return res.rows[0] ?? null;
}

export async function createOrdenRetiro({
  contenedorId,
  empresaRecolectora = null,
  patenteCamion = null,
  fechaProgramada = formatearFechaActual(),
}) {
  const res = await pool.query(
    `INSERT INTO OrdenesRetiros (
       contenedor_id, empresa_recolectora, patente_camion, fecha_programada
     ) VALUES ($1, $2, $3, $4)
     RETURNING id, contenedor_id, empresa_recolectora, patente_camion, fecha_programada, estado_orden`,
    [contenedorId, empresaRecolectora, patenteCamion, fechaProgramada],
  );

  return res.rows[0] ?? null;
}

export async function updateOrdenRetiro(
  ordenId,
  { empresaRecolectora, patenteCamion, fechaProgramada },
) {
  const res = await pool.query(
    `UPDATE OrdenesRetiros
        SET empresa_recolectora = $1,
            patente_camion = $2,
            fecha_programada = $3
      WHERE id = $4
      RETURNING id, contenedor_id, empresa_recolectora, patente_camion, fecha_programada, estado_orden`,
    [empresaRecolectora, patenteCamion, fechaProgramada, ordenId],
  );

  return res.rows[0] ?? null;
}

export async function deleteOrdenRetiro(ordenId) {
  const res = await pool.query(
    `DELETE FROM OrdenesRetiros WHERE id = $1 RETURNING id`,
    [ordenId],
  );

  return res.rows[0] ?? null;
}

export async function completarOrdenRetiro(ordenId) {
  const client = await pool.connect();

  const { rows } = await client.query(
    `SELECT contenedor_id FROM OrdenesRetiros WHERE id = $1 AND estado_orden = 'Pendiente'`,
    [ordenId]
  );

  if (rows.length === 0) {
    return null;
  }

  const contenedorId = rows[0].contenedor_id;
  await client.query(
    `UPDATE OrdenesRetiros SET estado_orden = 'Completada' WHERE id = $1`,
    [ordenId]
  );
  await client.query(
    `UPDATE ContenedoresHub SET carga_actual_kg = 0, estado_llenado = 'Vacante' WHERE id = $1`,
    [contenedorId]
  );
  return { ordenId, contenedorId };
}
