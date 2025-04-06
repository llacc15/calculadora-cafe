// Variables globales
let valorPorKilo = 0;

// Actualizar el valor por kilo
document.getElementById("actualizar-valor").addEventListener("click", function () {
    const nuevoValor = parseFloat(document.getElementById("valor-kilo").value);
    if (!isNaN(nuevoValor) && nuevoValor > 0) {
        valorPorKilo = nuevoValor;
        alert(`El valor por kilo ha sido actualizado a $${valorPorKilo.toFixed(2)} COP`);
    } else {
        alert("Por favor, ingresa un valor válido.");
    }
});

// Agregar nueva fila para recolector
document.getElementById("agregar-fila").addEventListener("click", function () {
    const tabla = document.getElementById("cuerpo-tabla");
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td><input type="text" class="nombre" placeholder="Nombre"></td>
        <td><input type="number" class="lunes" placeholder="0"></td>
        <td><input type="number" class="martes" placeholder="0"></td>
        <td><input type="number" class="miercoles" placeholder="0"></td>
        <td><input type="number" class="jueves" placeholder="0"></td>
        <td><input type="number" class="viernes" placeholder="0"></td>
        <td><input type="number" class="sabado" placeholder="0"></td>
        <td><input type="number" class="domingo" placeholder="0"></td>
    `;
    tabla.appendChild(fila);
});

// Calcular totales y cargas
document.getElementById("calcular-totales").addEventListener("click", function () {
    if (valorPorKilo === 0) {
        alert("Por favor, actualiza el valor por kilo antes de calcular.");
        return;
    }

    const filas = document.querySelectorAll("#cuerpo-tabla tr");
    const resumen = document.getElementById("tabla-resumen");
    resumen.innerHTML = ""; // Limpiar tabla resumen

    let totalGlobalKilos = 0;
    let totalGlobalPagar = 0;

    filas.forEach(fila => {
        const nombre = fila.querySelector(".nombre").value.trim();
        if (!nombre) return; // Ignorar filas vacías

        const kilos = [
            parseFloat(fila.querySelector(".lunes").value) || 0,
            parseFloat(fila.querySelector(".martes").value) || 0,
            parseFloat(fila.querySelector(".miercoles").value) || 0,
            parseFloat(fila.querySelector(".jueves").value) || 0,
            parseFloat(fila.querySelector(".viernes").value) || 0,
            parseFloat(fila.querySelector(".sabado").value) || 0,
            parseFloat(fila.querySelector(".domingo").value) || 0
        ];

        const totalKilos = kilos.reduce((acc, val) => acc + val, 0);
        const totalPagar = totalKilos * valorPorKilo;

        // Sumar al total global
        totalGlobalKilos += totalKilos;
        totalGlobalPagar += totalPagar;

        // Agregar a la tabla resumen
        const filaResumen = document.createElement("tr");
        filaResumen.innerHTML = `
            <td>${nombre}</td>
            <td>${totalKilos.toFixed(2)} kg</td>
            <td>${(totalKilos / 125).toFixed(2)} cargas</td> <!-- NUEVA COLUMNA -->
            <td>$${totalPagar.toFixed(2)} COP</td>
        `;
        resumen.appendChild(filaResumen);
    });

    // Mostrar totales globales al final
    const filaTotales = document.createElement("tr");
    filaTotales.innerHTML = `
        <td><strong>TOTAL</strong></td>
        <td><strong>${totalGlobalKilos.toFixed(2)} kg</strong></td>
        <td><strong>${(totalGlobalKilos / 125).toFixed(2)} cargas</strong></td>
        <td><strong>$${totalGlobalPagar.toFixed(2)} COP</strong></td>
    `;
    resumen.appendChild(filaTotales);
});

// Barra de progreso
let progresoRecoleccion = 0;

function actualizarProgreso() {
    let barraProgreso = document.getElementById("barradeprogreso");
    let porcentajeTexto = document.getElementById("porcentaje-progreso");

    barraProgreso.value = progresoRecoleccion;
    porcentajeTexto.textContent = progresoRecoleccion + "%";
}

// Simulación: Actualiza el progreso cada 2 segundos
setInterval(() => {
    if (progresoRecoleccion < 100) {
        progresoRecoleccion += 5;
        actualizarProgreso();
    }
}, 2000);
document.getElementById("descargar-csv").addEventListener("click", function () {
  let csv = "Nombre,Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo,Total Kilos,Total Pagar\n";
  document.querySelectorAll("#cuerpo-tabla tr").forEach(fila => {
      let datos = [];
      fila.querySelectorAll("input").forEach(input => {
          datos.push(input.value || 0);
      });
      let totalKilos = datos.slice(1).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      let totalPagar = totalKilos * valorPorKilo;
      csv += `${datos.join(",")},${totalKilos},${totalPagar.toFixed(2)}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "recoleccion_cafe.csv";
  a.click();
});
// Guardar registros en localStorage
document.getElementById("guardar-registros").addEventListener("click", function () {
  const filas = document.querySelectorAll("#cuerpo-tabla tr");
  let datos = [];

  filas.forEach(fila => {
      let recolector = {
          nombre: fila.querySelector(".nombre").value.trim(),
          lunes: parseFloat(fila.querySelector(".lunes").value) || 0,
          martes: parseFloat(fila.querySelector(".martes").value) || 0,
          miercoles: parseFloat(fila.querySelector(".miercoles").value) || 0,
          jueves: parseFloat(fila.querySelector(".jueves").value) || 0,
          viernes: parseFloat(fila.querySelector(".viernes").value) || 0,
          sabado: parseFloat(fila.querySelector(".sabado").value) || 0,
          domingo: parseFloat(fila.querySelector(".domingo").value) || 0
      };
      if (recolector.nombre) {
          datos.push(recolector);
      }
  });

  localStorage.setItem("registrosCafe", JSON.stringify(datos));
  alert("Registros guardados correctamente.");
});

// Cargar registros al recargar la página
function cargarRegistros() {
  const registrosGuardados = localStorage.getItem("registrosCafe");
  if (registrosGuardados) {
      const datos = JSON.parse(registrosGuardados);
      const tabla = document.getElementById("cuerpo-tabla");

      datos.forEach(recolector => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
              <td><input type="text" class="nombre" value="${recolector.nombre}"></td>
              <td><input type="number" class="lunes" value="${recolector.lunes}"></td>
              <td><input type="number" class="martes" value="${recolector.martes}"></td>
              <td><input type="number" class="miercoles" value="${recolector.miercoles}"></td>
              <td><input type="number" class="jueves" value="${recolector.jueves}"></td>
              <td><input type="number" class="viernes" value="${recolector.viernes}"></td>
              <td><input type="number" class="sabado" value="${recolector.sabado}"></td>
              <td><input type="number" class="domingo" value="${recolector.domingo}"></td>
          `;
          tabla.appendChild(fila);
      });
  }
}

// Ejecutar al cargar la página
window.onload = cargarRegistros;
document.getElementById('borrarRegistros').addEventListener('click', function () {
    if (confirm("¿Estás seguro de que deseas borrar los registros guardados?")) {
        localStorage.removeItem('resumenSemanal');
        alert("Registros borrados correctamente.");
        // También puedes limpiar la tabla en pantalla si quieres
        const resumenBody = document.getElementById('resumenBody');
        if (resumenBody) {
            resumenBody.innerHTML = '';
        }
    }
});
