let datos = [];
const facultadSelect = document.getElementById("facultadSelect");
const listaDocentes = document.getElementById("listaDocentes");
const buscador = document.getElementById("buscador");

fetch("../data/personal_epg_unac.json")
  .then(res => res.json())
  .then(data => {
    datos = data.facultades;
    llenarSelectorFacultades();
    mostrarDocentes();
  });

function llenarSelectorFacultades() {
  datos.forEach(fac => {
    const option = document.createElement("option");
    option.value = fac.nombre;
    option.textContent = fac.nombre;
    facultadSelect.appendChild(option);
  });

  facultadSelect.addEventListener("change", mostrarDocentes);
  buscador.addEventListener("input", mostrarDocentes);
}

function mostrarDocentes() {
  const facultadSeleccionada = facultadSelect.value;
  const textoBusqueda = buscador.value.toLowerCase();
  listaDocentes.innerHTML = "";

  let docentesFiltrados = [];

  datos.forEach(fac => {
    if (facultadSeleccionada === "todas" || facultadSeleccionada === fac.nombre) {
      fac.docentes.forEach(doc => {
        if (doc.nombre.toLowerCase().includes(textoBusqueda)) {
          docentesFiltrados.push({
            nombre: doc.nombre,
            cargo: doc.cargo,
            facultad: fac.nombre
          });
        }
      });
    }
  });

  if (docentesFiltrados.length === 0) {
    listaDocentes.innerHTML = "<li>No se encontraron docentes</li>";
    return;
  }

  docentesFiltrados.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = `${doc.nombre} – ${doc.cargo} (${doc.facultad})`;
    listaDocentes.appendChild(li);
  });
}
