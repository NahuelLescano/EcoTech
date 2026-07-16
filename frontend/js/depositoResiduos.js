import { API_DEPOSITOS } from "../env.js";

async function getAllDepositosResiduos() {
  try {
    const res = await fetch(API_DEPOSITOS);
    const depositos = await res.json();

    const tableDepositos = document.getElementById("table-depositos");
    tableDepositos.innerHTML = "";

    depositos.forEach((deposito) => {
      const fechaDb = deposito.fecha_deposito;
      const fechaFormateada = new Date(fechaDb).toLocaleDateString("es-Ar");

      const row = document.createElement("tr");

      const rowId = document.createElement("td");
      const rowContainerId = document.createElement("td");
      const rowDni = document.createElement("td");
      const rowPeso = document.createElement("td");
      const rowPuntos = document.createElement("td");
      const rowFecha = document.createElement("td");
      const rowAcciones = document.createElement("td");

      rowId.className = "has-text-centered";
      rowContainerId.className = "has-text-centered";
      rowDni.className = "has-text-centered";
      rowPeso.className = "has-text-centered";
      rowPuntos.className = "has-text-centered";
      rowFecha.className = "has-text-centered";
      rowAcciones.className = "acciones has-text-right";

      rowId.textContent = deposito.id;
      rowContainerId.textContent = deposito.contenedor_id;
      rowDni.textContent = deposito.dni_vecino;
      rowPeso.textContent = deposito.peso_ingresado_kg;
      rowPuntos.textContent = deposito.puntos_otorgados;
      rowFecha.textContent = fechaFormateada;

      const grupoBotones = document.createElement("div");
      grupoBotones.className = "buttons is-right";

      const botonEditar = document.createElement("a");

      botonEditar.className = "button is-small is-warning ";
      botonEditar.innerHTML =
        '<span class="icon"><i class="fas fa-pen"></i></span><span>Editar</span>';
      botonEditar.href = `deposito-editar.html?id=${deposito.id}`;

      const botonEliminar = document.createElement("button");

      botonEliminar.className = "button is-small is-danger";
      botonEliminar.innerHTML =
        '<span class="icon"><i class="fas fa-trash"></i></span><span>Eliminar</span>';
      botonEliminar.addEventListener("click", () => {
        eliminarDeposito(deposito.id);
      });

      grupoBotones.appendChild(botonEditar);
      grupoBotones.appendChild(botonEliminar);
      rowAcciones.appendChild(grupoBotones);

      row.appendChild(rowId);
      row.appendChild(rowContainerId);
      row.appendChild(rowDni);
      row.appendChild(rowPeso);
      row.appendChild(rowPuntos);
      row.appendChild(rowFecha);
      row.appendChild(rowAcciones);

      tableDepositos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al traer los depósitos:", error);
  }
}

async function eliminarDeposito(id) {
  const confirmar = confirm(
    "¿Estás seguro de que querés eliminar este depósito? Esto descontará los kilos del contenedor.",
  );
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_DEPOSITOS}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Deposito eliminado correctamente.");
      getAllDepositosResiduos();
    } else {
      alert(`Error: ${data.message || "No se pudo eliminar"}`);
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("Ocurrió un error de red al intentar eliminar.");
  }
}

getAllDepositosResiduos();
