import { API_CONTENEDORES } from "../env.js";

const grid = document.getElementById("contenedores-grid");
const notificacion = document.getElementById("notificacion");
const notificacionTexto = document.getElementById("notificacion-texto");
const btnDelete = notificacion.querySelector(".delete");

let contenedoresHub = [];

btnDelete.addEventListener("click", () => {
  notificacion.classList.add("is-hidden");
});

function mostrarNotificacion(mensaje, tipo) {
  notificacionTexto.textContent = mensaje;
  notificacion.className = `notification ${tipo}`;
}

function escaparHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function calcularPorcentajeCapacidad(contenedor) {
  const capacidadMaxima = Number(contenedor.capacidad_maxima_kg);
  const cargaActual = Number(contenedor.carga_actual_kg);

  if (!Number.isFinite(capacidadMaxima) || capacidadMaxima <= 0 || !Number.isFinite(cargaActual)) {
    return 0;
  }

  return Math.min(100, Math.max(0, (cargaActual / capacidadMaxima) * 100));
}

function crearTarjetaContenedor(contenedor) {
  const porcentajeCapacidad = calcularPorcentajeCapacidad(contenedor);
  const porcentajeRedondeado = Math.round(porcentajeCapacidad);

  const columna = document.createElement("div");
  columna.className = "column is-12-mobile is-6-tablet is-4-desktop";

  columna.innerHTML = `
    <div class="card">
        <div class="card-content">
                <p class="title is-5">Estación #${escaparHtml(contenedor.id)}</p>
                <p><strong>Barrio:</strong> ${escaparHtml(contenedor.ubicacion_barrio)}</p>
                <p><strong>Residuo:</strong> ${escaparHtml(contenedor.tipo_residuo_permitido)}</p>
                <p><strong>Estado:</strong> ${escaparHtml(contenedor.estado_llenado)}</p>
                <div class="mt-4">
                    <p class="mb-2"><strong>Capacidad actual:</strong> ${porcentajeRedondeado}%</p>
                    <progress class="progress is-primary" value="${porcentajeCapacidad}" max="100">
                        ${porcentajeRedondeado}%
                    </progress>
                    <p class="is-size-7 has-text-grey">${escaparHtml(contenedor.carga_actual_kg)} kg de ${escaparHtml(contenedor.capacidad_maxima_kg)} kg</p>
                </div>
                <div class="mt-4">
                    ${contenedor.estado_llenado === "Lleno"
                      ? `<a class="button is-link is-fullwidth" href="ordenes-retiro.html?contenedorId=${escaparHtml(contenedor.id)}">
                        Programar retiro
                    </a>`
                      : `<span class="button is-link is-light is-fullwidth is-static">Sin carga para retirar</span>`
                    }
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
      throw new Error(`Error al cargar los contenedores: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    contenedoresHub = Array.isArray(data) ? data : [];
    renderizarContenedoresHub();
  } catch (error) {
    contenedoresHub = [];
    renderizarContenedoresHub();
    mostrarNotificacion("No se pudieron cargar los contenedores", "is-danger");
  }
}

cargarContenedoresHub();
