import { pool } from "./pool.js";

export async function getOrdenesPendientes() {
  const res = await pool.query(
    `SELECT o.id, o.contenedor_id, o.estado_orden, o.fecha_programada,
            c.ubicacion_barrio, c.tipo_residuo_permitido,
            c.capacidad_maxima_kg, c.carga_actual_kg
     FROM OrdenesRetiros o
     JOIN ContenedoresHub c ON o.contenedor_id = c.id
     WHERE o.estado_orden = 'Pendiente'
     ORDER BY o.id ASC`
  );
  return res.rows;
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
