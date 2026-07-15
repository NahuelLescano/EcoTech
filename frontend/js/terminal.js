import { API_DEPOSITOS } from "../env.js";

const form = document.getElementById("form-deposito");
const notification = document.getElementById("notificacion");
const notificationText = document.getElementById("notificacion-texto");
const btnDelete = notification.querySelector(".delete");

btnDelete.addEventListener("click", () => {
  notification.classList.add("is-hidden");
});

const mostrarNotificacion = (mensaje, tipo) => {
  notificationText.textContent = mensaje;
  notification.classList.remove("is-hidden");
  notification.classList.add("notification", tipo);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    contenedorId: Number(document.getElementById("containerId").value),
    dniVecino: document.getElementById("dniVecino").value.trim(),
    tipoResiduo: document.getElementById("tipoResiduo").value,
    pesoIngresado: Number(document.getElementById("pesoIngresado").value),
  }

  try {
    const res = await fetch(API_DEPOSITOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json() : {};
    if (!res.ok) {
      mostrarNotificacion(data.message ?? "Error al registrar un depósito", "is-danger");
      return;
    }

    mostrarNotificacion(`Depósito registrado correctamente. Ganaste ${data.puntosOtorgados} puntos`, "is-success");
  } catch (err) {
    mostrarNotificacion("Error al registrar el depósito", "is-danger");
  }
});
