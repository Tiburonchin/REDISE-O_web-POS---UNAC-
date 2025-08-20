// Script para paginación dinámica de Programas Destacados en index.html
// Lee los datos de data/programas.json y muestra 6 programas por página

document.addEventListener('DOMContentLoaded', function () {
    const PROGRAMAS_JSON = 'data/programas.json';
    const PROGRAMAS_POR_PAGINA = 6;
    let programas = [];
    let paginaActual = 1;
    let totalPaginas = 1;

    const contenedor = document.getElementById('programas-container');
    // Ubicar la paginación a la derecha del section-header, y el título/subtítulo uno sobre otro
    const sectionHeader = contenedor.parentNode.querySelector('.section-header');
    const paginacion = document.createElement('div');
    paginacion.className = 'programas-paginacion d-flex align-items-center gap-2 mb-0';
    if (sectionHeader) {
        // Crear un contenedor flex para separar info y paginación
        const infoDiv = document.createElement('div');
        infoDiv.className = 'section-header-info text-center text-md-start';
        // Mover el título y subtítulo dentro de infoDiv
        const title = sectionHeader.querySelector('.section-title');
        const subtitle = sectionHeader.querySelector('.section-subtitle');
        if (title) infoDiv.appendChild(title);
        if (subtitle) infoDiv.appendChild(subtitle);
        // Limpiar sectionHeader y rearmar estructura
        sectionHeader.innerHTML = '';
        sectionHeader.classList.remove('text-center');
        sectionHeader.classList.add('d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'gap-3');
        sectionHeader.appendChild(infoDiv);
        sectionHeader.appendChild(paginacion);
    } else {
        contenedor.parentNode.insertBefore(paginacion, contenedor);
    }

    // Función para renderizar los programas de la página actual
    function renderizarProgramas() {
        contenedor.innerHTML = '';
        const inicio = (paginaActual - 1) * PROGRAMAS_POR_PAGINA;
        const fin = inicio + PROGRAMAS_POR_PAGINA;
        const programasPagina = programas.slice(inicio, fin);

        programasPagina.forEach(programa => {
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
                            <a href="admision/proceso_admision.html" class="btn-admision-programa">
                                <i class="fas fa-user-plus me-2"></i>Postular
                            </a>
                        </div>
                    </div>
                </article>
            `;
            contenedor.appendChild(col);
        });
    }

    // Función para renderizar los botones de paginación
    function renderizarPaginacion() {
        paginacion.innerHTML = '';
        // Botón anterior
        const btnPrev = document.createElement('button');
        btnPrev.className = 'btn btn-light border shadow-sm rounded-circle d-flex align-items-center justify-content-center p-2';
        btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        btnPrev.disabled = paginaActual === 1;
        btnPrev.title = 'Anterior';
        btnPrev.onclick = () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarProgramas();
                renderizarPaginacion();
                window.scrollTo({ top: contenedor.offsetTop - 100, behavior: 'smooth' });
            }
        };
        paginacion.appendChild(btnPrev);

        // Info de página (opcional, pequeño)
        const info = document.createElement('span');
        info.className = 'mx-2 small text-muted align-self-center';
        info.textContent = `${paginaActual} / ${totalPaginas}`;
        paginacion.appendChild(info);

        // Botón siguiente
        const btnNext = document.createElement('button');
        btnNext.className = 'btn btn-light border shadow-sm rounded-circle d-flex align-items-center justify-content-center p-2';
        btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
        btnNext.disabled = paginaActual === totalPaginas;
        btnNext.title = 'Siguiente';
        btnNext.onclick = () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarProgramas();
                renderizarPaginacion();
                window.scrollTo({ top: contenedor.offsetTop - 100, behavior: 'smooth' });
            }
        };
        paginacion.appendChild(btnNext);
    }

    // Cargar los programas desde el JSON y aplanar la estructura
    fetch(PROGRAMAS_JSON)
        .then(res => res.json())
        .then(data => {
            // Seleccionar solo un programa por facultad, máximo 12
            programas = [];
            if (data.facultades) {
                for (const key in data.facultades) {
                    const facultad = data.facultades[key];
                    if (facultad.programas && Array.isArray(facultad.programas) && facultad.programas.length > 0) {
                        // Tomar el primer programa de la facultad
                        const p = facultad.programas[0];
                        programas.push({
                            ...p,
                            facultad: facultad.nombre
                        });
                        // Si ya hay 12, no agregar más
                        if (programas.length === 12) break;
                    }
                }
            }
            // Si hay menos de 12, igual funcionará la paginación
            totalPaginas = 2;
            renderizarProgramas();
            renderizarPaginacion();
        })
        .catch(err => {
            contenedor.innerHTML = '<div class="alert alert-danger">No se pudieron cargar los programas destacados.</div>';
            paginacion.innerHTML = '';
        });
});
