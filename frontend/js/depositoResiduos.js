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

      rowId.textContent = deposito.id;
      rowContainerId.textContent = deposito.contenedor_id;
      rowDni.textContent = deposito.dni_vecino;
      rowPeso.textContent = deposito.peso_ingresado_kg;
      rowPuntos.textContent = deposito.puntos_otorgados;
      rowFecha.textContent = fechaFormateada;

      row.appendChild(rowId);
      row.appendChild(rowContainerId);
      row.appendChild(rowDni);
      row.appendChild(rowPeso);
      row.appendChild(rowPuntos);
      row.appendChild(rowFecha);

      rowId.className = "has-text-centered";
      rowContainerId.className = "has-text-centered";
      rowDni.className = "has-text-centered";
      rowPeso.className = "has-text-centered";
      rowPuntos.className = "has-text-centered";
      rowFecha.className = "has-text-centered";

      tableDepositos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al traer los depósitos:", error);
  }
}

getAllDepositosResiduos();
