import { API_ORDENES_RETIROS, API_CONTENEDORES } from "../env.js";

const tbody = document.getElementById("body-ordenes");
const loading = document.getElementById("loading");
const sinOrdenes = document.getElementById("sin-ordenes");
const tablaOrdenes = document.getElementById("tabla-ordenes");
const notificacion = document.getElementById("notificacion");
const notificacionTexto = document.getElementById("notificacion-texto");
const btnDelete = notificacion.querySelector(".delete");

btnDelete.addEventListener("click", () => {
  notificacion.classList.add("is-hidden");
});

function mostrarNotificacion(mensaje, tipo) {
  notificacionTexto.textContent = mensaje;
  notificacion.className = `notification ${tipo}`;
};

async function cargarOrdenes() {
  try {
    const res = await fetch(API_ORDENES_RETIROS);
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};
    const { ordenes, message } = data;
    if (!res.ok) {
      mostrarNotificacion(message ?? "Error al cargar órdenes", "is-danger");
      return;
    }

    loading.classList.add("is-hidden");

    if (ordenes.length === 0) {
      sinOrdenes.classList.remove("is-hidden");
      return;
    }

    tablaOrdenes.classList.remove("is-hidden");
    tbody.innerHTML = "";

    for (const orden of ordenes) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${orden.id}</td>
        <td>${orden.contenedor_id}</td>
        <td>${orden.ubicacion_barrio}</td>
        <td>${orden.tipo_residuo_permitido}</td>
        <td>${orden.carga_actual_kg} / ${orden.capacidad_maxima_kg}</td>
        <td>
            <button class="button is-small is-success btn-completar" data-id="${orden.id}">
                Marcar como completada
            </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    document.querySelectorAll(".btn-completar").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          await marcarCompletada(btn.dataset.id);
        } finally {
          btn.disabled = false;
        }
      });
    });
  } catch (err) {
    loading.classList.add("is-hidden");
    mostrarNotificacion("Error al cargar las órdenes de retiro", "is-danger");
  }
};

async function marcarCompletada(id) {
  try {
    const res = await fetch(`${API_ORDENES_RETIROS}/${id}/completar`, {
      method: "PUT",
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};
    const { message, contenedorId } = data;
    if (!res.ok) {
      mostrarNotificacion(message ?? "Error al registrar un depósito.", "is-danger");
      return;
    }

    mostrarNotificacion(`Orden #${id} completada. Contenedor ${contenedorId} reiniciado.`, "is-success");
    cargarOrdenes();
  } catch (err) {
    mostrarNotificacion("Error al completar la orden.", "is-danger");
  }
};


cargarOrdenes();

let contenedoresHub = [];
const grid = document.getElementById("contenedores-grid");

function calcularPorcentajeCapacidad(contenedor) {
  const capacidadMaxima = Number(contenedor.capacidad_maxima_kg);
  const cargaActual = Number(contenedor.carga_actual_kg);

  if (!Number.isFinite(capacidadMaxima) || capacidadMaxima <= 0 || !Number.isFinite(cargaActual)) {
    return 0;
  }

  return Math.min(100, Math.max(0, (cargaActual / capacidadMaxima) * 100));
}

// Escapa los caracteres especiales para evitar inyecciones de HTML.
function escaparHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function crearTarjetaContenedor(contenedor) {
  const porcentajeCapacidad = calcularPorcentajeCapacidad(contenedor);
  const porcentajeRedondeado = Math.round(porcentajeCapacidad);

  const columna = document.createElement("div");
  columna.className = "column is-12-mobile is-6-tablet is-4-desktop";

  columna.innerHTML = `
    <div class="card">
        <div class="card-content">
                <p class="title is-5">Estacion #${escaparHtml(contenedor.id)}</p>
                <p><strong>Barrio:</strong> ${escaparHtml(contenedor.ubicacion_barrio)}</p>
                <p><strong>Residuo:</strong> ${escaparHtml(contenedor.tipo_residuo_permitido)}</p>
                <p><strong>Estado:</strong> ${escaparHtml(contenedor.estado_llenado)}</p>
                <div class="mt-4">
                    <p class="mb-2"><strong>Capacidad actual:</strong>${porcentajeRedondeado}%</p>
                    <progress class="progress is-primary" value="${porcentajeCapacidad}" max="100">
                        ${porcentajeRedondeado}%
                    </progress>
                    <p class="is-size-7 has-text-grey">${escaparHtml(contenedor.carga_actual_kg)} kg de ${escaparHtml(contenedor.capacidad_maxima_kg)} kg</p>
                </div>
        </div>
    </div>
  `;

  return columna;
}

function renderizarContenedoresHub() {
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (contenedoresHub.length === 0) {
    grid.innerHTML = '<div class="column"><article class="message is-warning"><div class="message-body">No hay estaciones para mostrar.</div></article></div>';
    return;
  }

  contenedoresHub.forEach((contenedor) => {
    grid.appendChild(crearTarjetaContenedor(contenedor));
  });
}

async function cargarContenedoresHub() {
  try {
    const response = await fetch(API_CONTENEDORES);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    contenedoresHub = Array.isArray(data) ? data : [];
    renderizarContenedoresHub();

    console.log("ContenedoresHub cargados:", contenedoresHub);
  } catch (error) {
    console.error("No se pudieron cargar los contenedores:", error);
    contenedoresHub = [];
    renderizarContenedoresHub();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarContenedoresHub();
});
