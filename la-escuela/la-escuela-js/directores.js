let datos = [];
const facultadSelect = document.getElementById("facultadSelect");
const listaDirectores = document.getElementById("listaDirectores");
const buscador = document.getElementById("buscador");

fetch("../data/personal_epg_unac.json")
  .then(res => res.json())
  .then(data => {
    datos = data.facultades;
    llenarSelectorFacultades();
    mostrarDirectores();
  });

function llenarSelectorFacultades() {
  datos.forEach(fac => {
    const option = document.createElement("option");
    option.value = fac.nombre;
    option.textContent = fac.nombre;
    facultadSelect.appendChild(option);
  });

  facultadSelect.addEventListener("change", mostrarDirectores);
  buscador.addEventListener("input", mostrarDirectores);
}

function mostrarDirectores() {
  const facultadSeleccionada = facultadSelect.value;
  const textoBusqueda = buscador.value.toLowerCase();
  listaDirectores.innerHTML = "";

  let directoresFiltrados = [];

  datos.forEach(fac => {
    if (facultadSeleccionada === "todas" || facultadSeleccionada === fac.nombre) {
      if (fac.director) {
        directoresFiltrados.push({
          nombre: fac.director.nombre,
          cargo: fac.director.cargo,
          facultad: fac.nombre
        });
      }
    }
  });

  if (directoresFiltrados.length === 0) {
    listaDirectores.innerHTML = "<li>No se encontraron directores</li>";
    return;
  }

  directoresFiltrados.forEach(dir => {
    const li = document.createElement("li");
    li.textContent = `${dir.nombre} – ${dir.cargo} (${dir.facultad})`;
    listaDirectores.appendChild(li);
  });
}
