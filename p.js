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

// Calcular totales
document.getElementById("calcular-totales").addEventListener("click", function () {
  if (valorPorKilo === 0) {
    alert("Por favor, actualiza el valor por kilo antes de calcular.");
    return;
  }

  const filas = document.querySelectorAll("#cuerpo-tabla tr");
  const resumen = document.getElementById("tabla-resumen");
  resumen.innerHTML = ""; // Limpiar tabla resumen

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

    // Agregar a la tabla resumen
    const filaResumen = document.createElement("tr");
    filaResumen.innerHTML = `
      <td>${nombre}</td>
      <td>${totalKilos.toFixed(2)} kg</td>
      <td>$${totalPagar.toFixed(2)} COP</td>
    `;
    resumen.appendChild(filaResumen);
  });
  
});
// Calcular totales generales
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
      <td>$${totalPagar.toFixed(2)} COP</td>
    `;
    resumen.appendChild(filaResumen);
  });

  // Mostrar totales globales al final
  const filaTotales = document.createElement("tr");
  filaTotales.innerHTML = `
    <td><strong>TOTAL</strong></td>
    <td><strong>${totalGlobalKilos.toFixed(2)} kg</strong></td>
    <td><strong>$${totalGlobalPagar.toFixed(2)} COP</strong></td>
  `;
  resumen.appendChild(filaTotales);
});
