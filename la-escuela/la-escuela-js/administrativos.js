let datos = [];
const facultadSelect = document.getElementById("facultadSelect");
const listaAdministrativos = document.getElementById("listaAdministrativos");
const buscador = document.getElementById("buscador");

fetch("../data/personal_epg_unac.json")
  .then(res => res.json())
  .then(data => {
    datos = data.facultades;
    llenarSelectorFacultades();
    mostrarAdministrativos();
  });

function llenarSelectorFacultades() {
  datos.forEach(fac => {
    const option = document.createElement("option");
    option.value = fac.nombre;
    option.textContent = fac.nombre;
    facultadSelect.appendChild(option);
  });

  facultadSelect.addEventListener("change", mostrarAdministrativos);
  buscador.addEventListener("input", mostrarAdministrativos);
}

function mostrarAdministrativos() {
  const facultadSeleccionada = facultadSelect.value;
  const textoBusqueda = buscador.value.toLowerCase();
  listaAdministrativos.innerHTML = "";

  let administrativosFiltrados = [];

  datos.forEach(fac => {
    if (facultadSeleccionada === "todas" || facultadSeleccionada === fac.nombre) {
      (fac.administrativos || []).forEach(adm => {
        if (adm.nombre.toLowerCase().includes(textoBusqueda)) {
          administrativosFiltrados.push({
            nombre: adm.nombre,
            cargo: adm.cargo,
            facultad: fac.nombre
          });
        }
      });
    }
  });

  if (administrativosFiltrados.length === 0) {
    listaAdministrativos.innerHTML = "<li>No se encontraron administrativos</li>";
    return;
  }

  administrativosFiltrados.forEach(adm => {
    const li = document.createElement("li");
    li.textContent = `${adm.nombre} – ${adm.cargo} (${adm.facultad})`;
    listaAdministrativos.appendChild(li);
  });
}
