import { API_DEPOSITOS } from "../env.js";

// Obtengo el Id de la URL

const urlParams = new URLSearchParams(window.location.search);
const depositoId = urlParams.get("id");

const form = document.getElementById("form-editar-deposito");
const inputContenedor = document.getElementById("containerId");
const inputDni = document.getElementById("dniVecino");
const inputPeso = document.getElementById("pesoIngresado");

// Funcion para traer los datos del backend y rellenar el formulario

async function cargarDatosDeposito() {
  if (!depositoId) {
    alert("No se especifico un ID de deposito valido.");
    return;
  }

  try {
    const res = await fetch(`${API_DEPOSITOS}/${depositoId}`);
    if (!res.ok) throw new Error("No se pudo obtener el deposito");

    const deposito = await res.json();

    inputContenedor.value = deposito.contenedor_id;
    inputDni.value = deposito.dni_vecino;
    inputPeso.value = deposito.peso_ingresado_kg;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    alert("Hubo un error al cargar los datos del depósito.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Mando el objeto como lo espera el back
  const datosModificados = {
    contenedor_id: parseInt(inputContenedor.value),
    dni_vecino: inputDni.value,
    peso_ingresado_kg: parseInt(inputPeso.value),
  };

  try {
    const res = await fetch(`${API_DEPOSITOS}/${depositoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosModificados),
    });

    const data = await res.json();

    if (res.ok) {
      alert("¡Depósito actualizado con éxito!");
      // Lo mandamos de vuelta a la tabla principal
      window.location.href = "depositosResiduos.html";
    } else {
      alert(`Error: ${data.message || "No se pudo actualizar"}`);
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error al intentar guardar los cambios.");
  }
});

// Llamamos a la función apenas se abre la página para que se llenen los campos
cargarDatosDeposito();
