import { pool } from "./pool.js";

export async function createDepositoResiduo(
  contenedorId,
  dniVecino,
  pesoIngresado,
  puntosOtorgados,
) {
  const res = await pool.query(
    "INSERT INTO DepositosResiduos (contenedor_id, dni_vecino, peso_ingresado_kg, puntos_otorgados) values ($1, $2, $3, $4)",
    [contenedorId, dniVecino, pesoIngresado, puntosOtorgados],
  );
  return res.rowCount == 1;
}

export async function getContenedorById(id) {
  const res = await pool.query(
    "SELECT capacidad_maxima_kg, carga_actual_kg, tipo_residuo_permitido, estado_llenado FROM ContenedoresHub where id = $1 LIMIT 1",
    [id],
  );
  return res.rows[0];
}

export async function updateContenedorCargaYEstado(
  nuevaCarga,
  nuevoEstado,
  id,
) {
  const res = await pool.query(
    "UPDATE ContenedoresHub SET carga_actual_kg = $1, estado_llenado = $2 where id = $3",
    [nuevaCarga, nuevoEstado, id],
  );
}

export async function createOrdenRetiro(contenedorId) {
  const res = await pool.query(
    "INSERT INTO OrdenesRetiros (contenedor_id) values ($1)",
    [contenedorId],
  );
}
