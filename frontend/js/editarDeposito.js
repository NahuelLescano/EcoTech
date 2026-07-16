import { API_DEPOSITOS } from "../env.js";

const urlParams = new URLSearchParams(window.location.search);
const depositoId = urlParams.get("id");

const form = document.getElementById("form-editar-deposito");
const inputContenedor = document.getElementById("containerId");
const inputDni = document.getElementById("dniVecino");
const inputPeso = document.getElementById("pesoIngresado");
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

async function cargarDatosDeposito() {
  if (!depositoId) {
    mostrarNotificacion("No se especificó un ID de depósito válido", "is-danger");
    return;
  }

  try {
    const res = await fetch(`${API_DEPOSITOS}/${depositoId}`);
    if (!res.ok) throw new Error("No se pudo obtener el depósito");

    const deposito = await res.json();

    inputContenedor.value = deposito.contenedor_id;
    inputDni.value = deposito.dni_vecino;
    inputPeso.value = deposito.peso_ingresado_kg;
  } catch (error) {
    mostrarNotificacion("Hubo un error al cargar los datos del depósito", "is-danger");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosModificados = {
    contenedor_id: parseInt(inputContenedor.value),
    dni_vecino: inputDni.value,
    peso_ingresado_kg: parseInt(inputPeso.value),
  };

  try {
    const res = await fetch(`${API_DEPOSITOS}/${depositoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosModificados),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};

    if (res.ok) {
      mostrarNotificacion("Depósito actualizado con éxito", "is-success");
      setTimeout(() => {
        window.location.href = "depositosResiduos.html";
      }, 1500);
    } else {
      mostrarNotificacion(data.message ?? "No se pudo actualizar", "is-danger");
    }
  } catch (error) {
    mostrarNotificacion("Ocurrió un error al intentar guardar los cambios", "is-danger");
  }
});

cargarDatosDeposito();
