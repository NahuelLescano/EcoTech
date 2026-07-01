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
