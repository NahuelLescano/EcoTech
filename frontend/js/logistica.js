import { API_CONTENEDORES } from "../env.js";

let contenedoresHub = [];
const grid = document.getElementById("contenedores-grid");

function crearTarjetaContenedor(contenedor) {
	const columna = document.createElement("div");
	columna.className = "column is-12-mobile is-6-tablet is-4-desktop";

	columna.innerHTML = `
		<div class="card">
			<div class="card-content">
				<p class="title is-5">Estacion #${contenedor.id}</p>
				<p><strong>Barrio:</strong> ${contenedor.ubicacion_barrio}</p>
				<p><strong>Residuo:</strong> ${contenedor.tipo_residuo_permitido}</p>
				<p><strong>Estado:</strong> ${contenedor.estado_llenado}</p>
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
