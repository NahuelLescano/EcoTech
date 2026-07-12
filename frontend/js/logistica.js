import { API_CONTENEDORES } from "../env.js";

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
