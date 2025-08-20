// Script para paginación dinámica de Programas Destacados en index.html
// Lee los datos de data/programas.json y muestra 3 programas por página

document.addEventListener('DOMContentLoaded', function () {
    const PROGRAMAS_JSON = 'data/programas.json';
    const PROGRAMAS_POR_MOSTRAR = 3;
    let programas = [];
    let intervalo = null;

    const contenedor = document.getElementById('programas-container');

    function obtenerProgramasAleatorios(arr, n) {
        const copia = [...arr];
        const resultado = [];
        for (let i = 0; i < n && copia.length > 0; i++) {
            const idx = Math.floor(Math.random() * copia.length);
            resultado.push(copia.splice(idx, 1)[0]);
        }
        return resultado;
    }

    function renderizarProgramasAleatorios() {
        contenedor.classList.remove('fade-in');
        contenedor.innerHTML = '';
        const seleccionados = obtenerProgramasAleatorios(programas, PROGRAMAS_POR_MOSTRAR);
        seleccionados.forEach(programa => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4';
            col.innerHTML = `
                <article class="programa-card">
                    <div class="card-header">
                        <img src="${programa.imagen_1 || programa.imagen || ''}" alt="${programa.nombre}" class="card-image" loading="lazy">
                        <div class="card-overlay"></div>
                        <span class="tipo-badge tipo-${programa.tipo.toLowerCase()}">${programa.tipo.charAt(0).toUpperCase() + programa.tipo.slice(1)}</span>
                    </div>
                    <div class="card-body">
                        <div class="facultad-name">${programa.facultad || ''}</div>
                        <h3 class="programa-title">${programa.nombre}</h3>
                        <p class="programa-description">${programa.descripcion}</p>
                        <div class="programa-details">
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${programa.duracion}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${programa.modalidad}</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="detalle_programa.html?slug=${programa.slug}" class="btn-ver-mas">
                                <i class="fas fa-eye me-2"></i>Ver más
                            </a>
                            <a href="admision/Proceso_admision.html" class="btn-admision-programa">
                                <i class="fas fa-user-plus me-2"></i>Postular
                            </a>
                        </div>
                    </div>
                </article>
            `;
            contenedor.appendChild(col);
        });
        // Forzar reflow para reiniciar la animación
        void contenedor.offsetWidth;
        contenedor.classList.add('fade-in');
    }

    fetch(PROGRAMAS_JSON)
        .then(res => res.json())
        .then(data => {
            programas = [];
            if (data.facultades) {
                for (const key in data.facultades) {
                    const facultad = data.facultades[key];
                    if (facultad.programas && Array.isArray(facultad.programas)) {
                        facultad.programas.forEach(p => {
                            programas.push({
                                ...p,
                                facultad: facultad.nombre,
                                modalidad: facultad.modalidad,
                                duracion: p.duracion || facultad.duracion?.maestria || ''
                            });
                        });
                    }
                }
            }
            renderizarProgramasAleatorios();
            if (intervalo) clearInterval(intervalo);
            intervalo = setInterval(renderizarProgramasAleatorios, 5000); // Cambia cada 4 segundos
        })
        .catch(err => {
            console.error('Error al cargar los programas:', err);
            contenedor.innerHTML = '<div class="alert alert-danger">No se pudieron cargar los programas destacados.</div>';
        });
});