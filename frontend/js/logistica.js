import { API_CONTENEDORES } from "../env.js";

let contenedoresHub = [];

async function cargarContenedoresHub() {
	try {
		const response = await fetch(API_CONTENEDORES);

		if (!response.ok) {
			throw new Error(`Error HTTP ${response.status}`);
		}

		const data = await response.json();
		contenedoresHub = Array.isArray(data) ? data : [];

		console.log("ContenedoresHub cargados:", contenedoresHub);
	} catch (error) {
		console.error("No se pudieron cargar los contenedores:", error);
		contenedoresHub = [];
	}
}

document.addEventListener("DOMContentLoaded", () => {
	cargarContenedoresHub();
});
