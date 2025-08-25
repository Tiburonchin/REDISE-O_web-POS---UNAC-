/**
 * DOCENTES PAGE - JAVASCRIPT
 * Funcionalidad para la página de docentes de la Escuela de Posgrado UNAC
 */

document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos de docentes desde el archivo JSON externo
    let docentes = [];
    let facultadesData = {};

    // Elementos del DOM
    const docentesContainer = document.getElementById('docentes-container');
    const facultadFilter = document.getElementById('facultad-filter');
    const tipoFilter = document.getElementById('tipo-filter');
    const buscarInput = document.getElementById('buscar-docente');
    const cargarMasBtn = document.getElementById('cargar-mas');
    
    // Variables de estado
    let docentesFiltrados = [];
    let docentesMostrados = 6;
    const docentesPorPagina = 6;

    // Inicializar la página
    function init() {
        fetch('data/docentes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de docentes');
                }
                return response.json();
            })
            .then(data => {
                facultadesData = data.facultades;
                
                // Convertir la estructura anidada a un array plano para compatibilidad
                docentes = [];
                Object.keys(facultadesData).forEach(facultadId => {
                    const facultad = facultadesData[facultadId];
                    facultad.docentes.forEach(docente => {
                        docentes.push({
                            ...docente,
                            facultad: facultadId,
                            facultadNombre: facultad.nombre
                        });
                    });
                });
                
                docentesFiltrados = [...docentes];
                
                renderFacultadFilter();
                renderDocentes();
                setupEventListeners();
                setupStatsCounter();
                
                console.log('✅ Datos cargados:', docentes.length, 'docentes y', Object.keys(facultadesData).length, 'facultades');
            })
            .catch(error => {
                console.error('❌ Error al cargar docentes:', error);
                docentesContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3 text-warning"></i>
                        <h3 class="h4">No se pudieron cargar los docentes</h3>
                        <p class="text-muted">Por favor, recarga la página</p>
                        <button onclick="location.reload()" class="btn btn-primary mt-3">
                            <i class="fas fa-refresh"></i> Recargar página
                        </button>
                    </div>
                `;
            });
    }

    // Renderizar el filtro de facultades dinámicamente
    function renderFacultadFilter() {
        if (!facultadFilter || !facultadesData) return;
        
        // Limpiar el select y mantener solo la opción "Todas"
        facultadFilter.innerHTML = '<option value="todos">Todas las facultades</option>';
        
        // Agregar las facultades dinámicamente
        Object.keys(facultadesData).forEach(facultadId => {
            const facultad = facultadesData[facultadId];
            const option = document.createElement('option');
            option.value = facultadId;
            option.textContent = facultad.nombre;
            facultadFilter.appendChild(option);
        });
        
        console.log('✅ Filtro de facultades renderizado con', Object.keys(facultadesData).length, 'opciones');
    }

    // Configurar event listeners
    function setupEventListeners() {
        facultadFilter.addEventListener('change', filtrarDocentes);
        tipoFilter.addEventListener('change', filtrarDocentes);
        buscarInput.addEventListener('input', filtrarDocentes);
        cargarMasBtn.addEventListener('click', cargarMasDocentes);
    }

    // Filtrar docentes según los criterios seleccionados
    function filtrarDocentes() {
        const facultadSeleccionada = facultadFilter.value;
        const tipoSeleccionado = tipoFilter.value;
        const busqueda = buscarInput.value.toLowerCase();

        docentesFiltrados = docentes.filter(docente => {
            const cumpleFacultad = facultadSeleccionada === 'todos' || docente.facultad === facultadSeleccionada;
            const cumpleTipo = tipoSeleccionado === 'todos' || docente.tipo === tipoSeleccionado;
            const cumpleBusqueda = 
                docente.nombre.toLowerCase().includes(busqueda) ||
                docente.titulo.toLowerCase().includes(busqueda) ||
                docente.especialidad.toLowerCase().includes(busqueda);

            return cumpleFacultad && cumpleTipo && cumpleBusqueda;
        });

        docentesMostrados = docentesPorPagina;
        renderDocentes();
        
        console.log(`🔍 Filtrado: ${docentesFiltrados.length} docentes encontrados`);
    }

    // Renderizar la lista de docentes
    function renderDocentes() {
        if (docentesFiltrados.length === 0) {
            docentesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                    <h3 class="h4">No se encontraron docentes</h3>
                    <p class="text-muted">Intenta con otros criterios de búsqueda</p>
                </div>
            `;
            cargarMasBtn.style.display = 'none';
            return;
        }

        const docentesAMostrar = docentesFiltrados.slice(0, docentesMostrados);
        const hayMasParaMostrar = docentesMostrados < docentesFiltrados.length;
        
        cargarMasBtn.style.display = hayMasParaMostrar ? 'inline-flex' : 'none';

        docentesContainer.innerHTML = docentesAMostrar.map(docente => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="docente-card">
                    <div class="docente-info">
                        <h3 class="docente-name">${docente.nombre}</h3>
                        <div class="docente-title">${docente.titulo}</div>
                        <span class="docente-faculty">${docente.facultadNombre}</span>
                        <p class="docente-bio">
                            Especialista en ${docente.especialidad} con más de ${docente.experiencia} de experiencia en docencia universitaria.
                        </p>
                        <div class="docente-meta">
                            <span class="docente-type">${getTipoDocente(docente.tipo)}</span>
                            <a href="mailto:${docente.email}" class="docente-cta">
                                Contactar <i class="fas fa-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Cargar más docentes
    function cargarMasDocentes() {
        docentesMostrados += docentesPorPagina;
        renderDocentes();
        
        // Desplazarse suavemente al final de la lista
        setTimeout(() => {
            docentesContainer.lastElementChild.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }

    // Obtener el tipo de docente
    function getTipoDocente(tipo) {
        const tipos = {
            'planta': 'Docente de Planta',
            'contratado': 'Docente Contratado',
            'visitante': 'Docente Visitante'
        };
        return tipos[tipo] || 'Docente';
    }

    // Configurar el contador de estadísticas
    function setupStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 segundos
            const step = Math.ceil(target / (duration / 16)); // 60fps
            let current = 0;
            
            const updateCount = () => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + '+';
                } else {
                    stat.textContent = current;
                    requestAnimationFrame(updateCount);
                }
            };
            
            // Iniciar la animación cuando el elemento sea visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    observer.unobserve(stat);
                }
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    // Inicializar la página
    init();
});
