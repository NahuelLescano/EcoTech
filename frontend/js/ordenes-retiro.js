import { API_ORDENES_RETIROS } from "../env.js";

const tbody = document.getElementById("body-ordenes");
const form = document.getElementById("form-orden");
const formTitle = document.getElementById("form-title");
const ordenIdInput = document.getElementById("ordenId");
const contenedorIdInput = document.getElementById("contenedorId");
const empresaRecolectoraInput = document.getElementById("empresaRecolectora");
const patenteCamionInput = document.getElementById("patenteCamion");
const fechaProgramadaInput = document.getElementById("fechaProgramada");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const sinOrdenes = document.getElementById("sin-ordenes");
const notificacion = document.getElementById("notificacion");
const notificacionTexto = document.getElementById("notificacion-texto");
const btnDelete = notificacion.querySelector(".delete");

const params = new URLSearchParams(window.location.search);
const contenedorIdDesdeLogistica = params.get("contenedorId");

btnDelete.addEventListener("click", () => {
  notificacion.classList.add("is-hidden");
});

function mostrarNotificacion(mensaje, tipo) {
  notificacionTexto.textContent = mensaje;
  notificacion.classList.remove("is-hidden");
  notificacion.classList.add("notification", tipo);

  setTimeout(() => {
    notificacion.classList.add("is-hidden");
  }, 3000);
}

function escaparHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function limpiarFormulario() {
  ordenIdInput.value = "";
  form.reset();
  contenedorIdInput.readOnly = false;
  formTitle.textContent = "Programar retiro";
  btnGuardar.textContent = "Guardar";
  btnCancelar.classList.add("is-hidden");

  if (contenedorIdDesdeLogistica) {
    contenedorIdInput.value = contenedorIdDesdeLogistica;
  }
}

function cargarOrdenEnFormulario(orden) {
  ordenIdInput.value = orden.id;
  contenedorIdInput.value = orden.contenedor_id;
  contenedorIdInput.readOnly = true;
  empresaRecolectoraInput.value = orden.empresa_recolectora ?? "";
  patenteCamionInput.value = orden.patente_camion ?? "";
  fechaProgramadaInput.value = orden.fecha_programada ?? "";
  formTitle.textContent = `Editar orden #${orden.id}`;
  btnGuardar.textContent = "Actualizar";
  btnCancelar.classList.remove("is-hidden");
}

function crearAccionBoton(texto, clase, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button is-small ${clase} mr-2 mb-1`;
  button.textContent = texto;
  button.addEventListener("click", onClick);
  return button;
}

function renderizarOrdenes(ordenes) {
  tbody.innerHTML = "";

  if (ordenes.length === 0) {
    sinOrdenes.classList.remove("is-hidden");
    limpiarFormulario();
    return;
  }

  sinOrdenes.classList.add("is-hidden");

  for (const orden of ordenes) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escaparHtml(orden.id)}</td>
      <td>${escaparHtml(orden.contenedor_id)}</td>
      <td>${escaparHtml(orden.empresa_recolectora ?? "-")}</td>
      <td>${escaparHtml(orden.patente_camion ?? "-")}</td>
      <td>${escaparHtml(formatearFecha(orden.fecha_programada))}</td>
      <td>${escaparHtml(orden.estado_orden ?? "-")}</td>
    `;

    const accionesTd = document.createElement("td");

    if (orden.estado_orden === "Pendiente" && Number(orden.carga_actual_kg) > 0) {
      accionesTd.appendChild(
        crearAccionBoton("Completar", "is-info", async () => {
          await completarOrden(orden.id);
        }),
      );
    }

    if (orden.estado_orden === "Completada") {
      accionesTd.appendChild(
        crearAccionBoton("Despachar", "is-success", async () => {
          await despacharOrden(orden.id);
        }),
      );
    }

    accionesTd.appendChild(
      crearAccionBoton("Editar", "is-warning", () => cargarOrdenEnFormulario(orden)),
    );
    accionesTd.appendChild(
      crearAccionBoton("Eliminar", "is-danger", async () => {
        const confirmado = await mostrarConfirm(`¿Eliminar la orden #${orden.id}?`);
        if (!confirmado) return;

        await eliminarOrden(orden.id);
      }),
    );

    tr.appendChild(accionesTd);
    tbody.appendChild(tr);
  }
}

async function cargarOrdenes() {
  try {
    const res = await fetch(API_ORDENES_RETIROS);
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al cargar las órdenes de retiro", "is-danger");
      tbody.innerHTML = "";
      sinOrdenes.classList.add("is-hidden");
      return;
    }

    renderizarOrdenes(Array.isArray(data.ordenes) ? data.ordenes : []);
  } catch (error) {
    mostrarNotificacion("Error al cargar las órdenes de retiro", "is-danger");
  }
}

async function eliminarOrden(id) {
  try {
    const res = await fetch(`${API_ORDENES_RETIROS}/${id}`, {
      method: "DELETE",
    });
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al eliminar la orden", "is-danger");
      return;
    }

    if (ordenIdInput.value === String(id)) {
      limpiarFormulario();
    }

    mostrarNotificacion(data.message ?? "Orden eliminada correctamente", "is-success");
    cargarOrdenes();
  } catch (error) {
    mostrarNotificacion("Error al eliminar la orden", "is-danger");
  }
}

async function guardarOrden(event) {
  event.preventDefault();

  const body = {
    contenedorId: Number(contenedorIdInput.value),
    empresaRecolectora: empresaRecolectoraInput.value.trim(),
    patenteCamion: patenteCamionInput.value.trim(),
    fechaProgramada: fechaProgramadaInput.value.trim(),
  };

  const ordenId = ordenIdInput.value;
  const url = ordenId ? `${API_ORDENES_RETIROS}/${ordenId}` : API_ORDENES_RETIROS;
  const method = ordenId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al guardar la orden", "is-danger");
      return;
    }

    mostrarNotificacion(data.message ?? "Orden guardada correctamente", "is-success");
    limpiarFormulario();
    cargarOrdenes();
  } catch (error) {
    mostrarNotificacion("Error al guardar la orden", "is-danger");
  }
}

btnCancelar.addEventListener("click", limpiarFormulario);
form.addEventListener("submit", guardarOrden);

if (contenedorIdDesdeLogistica) {
  contenedorIdInput.value = contenedorIdDesdeLogistica;
}

function formatearFecha(fecha) {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
}

async function completarOrden(id) {
  const confirmado = await mostrarConfirm(`¿Marcar la orden #${id} como completada?`);
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_ORDENES_RETIROS}/${id}/completar`, {
      method: "PUT",
    });
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al completar la orden", "is-danger");
      return;
    }

    mostrarNotificacion(data.message ?? "Orden completada correctamente", "is-success");
    cargarOrdenes();
  } catch (error) {
    mostrarNotificacion("Error al completar la orden", "is-danger");
  }
}

async function despacharOrden(id) {
  const confirmado = await mostrarConfirm(`¿Despachar orden #${id}? El contenedor será vaciado y la orden eliminada.`);
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_ORDENES_RETIROS}/${id}/despachar`, {
      method: "DELETE",
    });
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al despachar la orden", "is-danger");
      return;
    }

    mostrarNotificacion(data.message ?? "Orden despachada correctamente", "is-success");
    cargarOrdenes();
  } catch (error) {
    mostrarNotificacion("Error al despachar la orden", "is-danger");
  }
}

function mostrarConfirm(mensaje) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const mensajeEl = document.getElementById("confirm-mensaje");
    const btnAceptar = document.getElementById("confirm-aceptar");
    const btnCancelar = document.getElementById("confirm-cancelar");
    const btnClose = document.getElementById("confirm-cancel");

    mensajeEl.textContent = mensaje;
    modal.classList.add("is-active");

    function cerrar(resultado) {
      modal.classList.remove("is-active");
      resolve(resultado);
    }

    btnAceptar.onclick = () => cerrar(true);
    btnCancelar.onclick = () => cerrar(false);
    btnClose.onclick = () => cerrar(false);
    modal.querySelector(".modal-background").onclick = () => cerrar(false);
  });
}
cargarOrdenes();
