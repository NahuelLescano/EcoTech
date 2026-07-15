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

export async function getAllDepositos() {
  const res = await pool.query("SELECT * FROM DepositosResiduos");
  return res.rows;
}

export async function getDepositoById(id) {
  const res = await pool.query(
    "SELECT * FROM DepositosResiduos WHERE id = $1",
    [id],
  );

  return res.rows[0];
}

// Funcion Auxiliar para sincronizarContenedor

async function sincronizarContenedor(contenedor_id) {
  // Traemos todos los depósitos de este contenedor
  const depositoRes = await pool.query(
    "SELECT peso_ingresado_kg FROM DepositosResiduos WHERE contenedor_id = $1",
    [contenedor_id],
  );
  const listaDepositos = depositoRes.rows;

  // Suma los pesos
  let carga_actual = 0;
  for (let i = 0; i < listaDepositos.length; i++) {
    carga_actual += listaDepositos[i].peso_ingresado_kg;
  }

  // Traemos la capacidad máxima
  const contenedorRes = await pool.query(
    "SELECT capacidad_maxima_kg FROM ContenedoresHub WHERE id = $1",
    [contenedor_id],
  );

  if (contenedorRes.rows.length === 0) return;
  const capacidad_maxima = contenedorRes.rows[0].capacidad_maxima_kg;

  let nuevo_estado = "Vacante";

  const limiteLleno = capacidad_maxima * 0.9;

  if (carga_actual >= limiteLleno) {
    nuevo_estado = "Lleno";
  }

  // Actualizamos el contenedor
  await pool.query(
    "UPDATE ContenedoresHub SET carga_actual_kg = $1, estado_llenado = $2 WHERE id = $3",
    [carga_actual, nuevo_estado, contenedor_id],
  );
}

export async function updateDeposito(
  id,
  contenedor_id,
  dni_vecino,
  peso_ingresado_kg,
  puntos_otorgados,
) {
  // Buscamos el contenedor viejo
  const depPrevio = await pool.query(
    "SELECT contenedor_id FROM DepositosResiduos WHERE id = $1",
    [id],
  );
  if (depPrevio.rows.length === 0) return null;
  const contenedor_viejo_id = depPrevio.rows[0].contenedor_id;

  const res = await pool.query(
    "UPDATE DepositosResiduos SET contenedor_id = $1, dni_vecino = $2, peso_ingresado_kg = $3, puntos_otorgados = $4 WHERE id = $5 RETURNING *;",
    [contenedor_id, dni_vecino, peso_ingresado_kg, puntos_otorgados, id],
  );

  const depositoActualizado = res.rows[0];

  // Sincronizo
  await sincronizarContenedor(contenedor_id);
  if (contenedor_viejo_id !== contenedor_id) {
    await sincronizarContenedor(contenedor_viejo_id);
  }

  return depositoActualizado;
}

export async function deleteDepositoById(id) {
  const res = await pool.query(
    "DELETE FROM DepositosResiduos WHERE id = $1 RETURNING *",
    [id],
  );
  const depositoEliminado = res.rows[0];

  // Sincronizo
  if (depositoEliminado) {
    await sincronizarContenedor(depositoEliminado.contenedor_id);
  }

  return depositoEliminado;
}
