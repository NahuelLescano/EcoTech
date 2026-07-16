import { API_DEPOSITOS } from "../env.js";

const tbody = document.getElementById("body-depositos");
const sinDepositos = document.getElementById("sin-depositos");
const totalDepositos = document.getElementById("total-depositos");
const totalPuntos = document.getElementById("total-puntos");
const promedioPuntos = document.getElementById("promedio-puntos");

function formatearFecha(fecha) {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
}

function escaparHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderizarEstadisticas(depositos) {
  totalDepositos.textContent = depositos.length;
  const puntos = depositos.reduce((sum, d) => sum + Number(d.puntos_otorgados), 0);
  totalPuntos.textContent = puntos.toLocaleString("es-AR");
  const promedio = depositos.length > 0 ? Math.round(puntos / depositos.length) : 0;
  promedioPuntos.textContent = promedio.toLocaleString("es-AR");
}

function renderizarDepositos(depositos) {
  tbody.innerHTML = "";

  if (depositos.length === 0) {
    sinDepositos.classList.remove("is-hidden");
    return;
  }

  sinDepositos.classList.add("is-hidden");

  for (const d of depositos) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escaparHtml(d.id)}</td>
      <td>${escaparHtml(d.contenedor_id)}</td>
      <td>${escaparHtml(d.ubicacion_barrio ?? "-")}</td>
      <td>${escaparHtml(d.tipo_residuo_permitido ?? "-")}</td>
      <td>${escaparHtml(d.dni_vecino)}</td>
      <td>${escaparHtml(d.peso_ingresado_kg)} kg</td>
      <td>${escaparHtml(d.puntos_otorgados)} pts</td>
      <td>${formatearFecha(d.fecha_deposito)}</td>
    `;
    tbody.appendChild(tr);
  }
}
async function cargarDepositos() {
  try {
    const res = await fetch(API_DEPOSITOS);
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : [];

    const depositos = Array.isArray(data) ? data : (data.depositos ?? []);
    renderizarEstadisticas(depositos);
    renderizarDepositos(depositos);
  } catch (error) {
    console.error("Error al cargar depositos: ", error.message);
  }
}

cargarDepositos();
