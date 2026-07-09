import { API_ORDENES_RETIROS } from "../env.js";

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

const mostrarNotificacion = (mensaje, tipo) => {
  notificacionTexto.textContent = mensaje;
  notificacion.className = `notification ${tipo}`;
};

const cargarOrdenes = async () => {
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

const marcarCompletada = async (id) => {
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
