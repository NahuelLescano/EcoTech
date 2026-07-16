import { API_DEPOSITOS } from "../env.js";

const tbody = document.getElementById("table-depositos");
const notificacion = document.getElementById("notificacion");
const notificacionTexto = document.getElementById("notificacion-texto");
const btnDelete = notificacion.querySelector(".delete");

btnDelete.addEventListener("click", () => {
  notificacion.classList.add("is-hidden");
});

function mostrarNotificacion(mensaje, tipo) {
  notificacionTexto.textContent = mensaje;
  notificacion.classList.remove("is-hidden");
  notificacion.className = `notification ${tipo}`;

  setTimeout(() => {
    notificacion.classList.add("is-hidden");
  }, 3000);
}

function escaparHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
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

async function getAllDepositosResiduos() {
  try {
    const res = await fetch(API_DEPOSITOS);
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : [];

    const depositos = Array.isArray(data) ? data : [];
    tbody.innerHTML = "";

    depositos.forEach((deposito) => {
      const fechaFormateada = new Date(deposito.fecha_deposito).toLocaleDateString("es-AR");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="has-text-centered">${escaparHtml(deposito.id)}</td>
        <td class="has-text-centered">${escaparHtml(deposito.contenedor_id)}</td>
        <td class="has-text-centered">${escaparHtml(deposito.dni_vecino)}</td>
        <td class="has-text-centered">${escaparHtml(deposito.peso_ingresado_kg)} kg</td>
        <td class="has-text-centered">${escaparHtml(deposito.puntos_otorgados)} pts</td>
        <td class="has-text-centered">${fechaFormateada}</td>
        <td class="has-text-right">
          <div class="buttons is-right">
            <a class="button is-small is-warning" href="deposito-editar.html?id=${escaparHtml(deposito.id)}">
              <span class="icon"><i class="fas fa-pen"></i></span><span>Editar</span>
            </a>
            <button class="button is-small is-danger" data-id="${escaparHtml(deposito.id)}">
              <span class="icon"><i class="fas fa-trash"></i></span><span>Eliminar</span>
            </button>
          </div>
        </td>
      `;

      tr.querySelector(".is-danger").addEventListener("click", () => eliminarDeposito(deposito.id));
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarNotificacion("Error al traer los depósitos", "is-danger");
  }
}

async function eliminarDeposito(id) {
  const confirmado = await mostrarConfirm("¿Estás seguro de que querés eliminar este depósito? Esto descontará los kilos del contenedor.");
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_DEPOSITOS}/${id}`, { method: "DELETE" });
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (res.ok) {
      mostrarNotificacion("Depósito eliminado correctamente", "is-success");
      getAllDepositosResiduos();
    } else {
      mostrarNotificacion(data.message ?? "No se pudo eliminar", "is-danger");
    }
  } catch (error) {
    mostrarNotificacion("Ocurrió un error al intentar eliminar", "is-danger");
  }
}

getAllDepositosResiduos();
