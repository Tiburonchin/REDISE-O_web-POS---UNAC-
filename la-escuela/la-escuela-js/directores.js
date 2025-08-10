// directores.js - Renderizado y filtrado de directores

document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('listaDirectores');
  const buscador = document.getElementById('buscador');
  const facultadSelect = document.getElementById('facultadSelect');
  let directores = [];

  fetch('data/directores.json')
    .then(res => res.json())
    .then(data => {
      directores = data;
      // Llenar select de facultades
      const facultades = [...new Set(directores.map(d => d.facultad))];
      facultades.forEach(fac => {
        const opt = document.createElement('option');
        opt.value = fac;
        opt.textContent = fac;
        facultadSelect.appendChild(opt);
      });
      renderLista();
    });


  function renderLista(filtroNombre = '', filtroFacultad = 'todas') {
    lista.innerHTML = '';
    let filtrados = directores.filter(d =>
      d.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      (filtroFacultad === 'todas' || d.facultad === filtroFacultad)
    );
    if (filtrados.length === 0) {
      lista.innerHTML = '<div style="text-align:center;width:100%">No se encontraron directores.</div>';
      return;
    }
    filtrados.forEach((d, idx) => {
      const card = document.createElement('div');
      card.className = 'director-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Ver más sobre ${d.nombre}`);
      card.innerHTML = `
        <img src="${d.foto}" alt="${d.nombre}" class="director-foto" loading="lazy">
        <div class="director-nombre">${d.nombre}</div>
        <div class="director-facultad">${d.facultad}</div>
        <div class="director-cargo">${d.cargo}</div>
      `;
      card.addEventListener('click', () => mostrarModal(d));
      card.addEventListener('keypress', (e) => { if (e.key === 'Enter') mostrarModal(d); });
      lista.appendChild(card);
    });
  }

  function mostrarModal(director) {
    document.getElementById('modalDirectorLabel').textContent = director.nombre;
    document.getElementById('modalDirectorFoto').src = director.foto;
    document.getElementById('modalDirectorFoto').alt = director.nombre;
    document.getElementById('modalDirectorFacultad').textContent = director.facultad;
    document.getElementById('modalDirectorCargo').textContent = director.cargo;
    document.getElementById('modalDirectorDescripcion').textContent = director.descripcion;
    const modal = new bootstrap.Modal(document.getElementById('modalDirector'));
    modal.show();
  }

  buscador.addEventListener('input', () => {
    renderLista(buscador.value, facultadSelect.value);
  });
  facultadSelect.addEventListener('change', () => {
    renderLista(buscador.value, facultadSelect.value);
  });
});
