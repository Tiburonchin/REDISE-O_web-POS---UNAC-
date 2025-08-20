/**
 * PROGRAMAS PAGE - JAVASCRIPT
 * Funcionalidad para la página de programas académicos de la Escuela de Posgrado UNAC
 */

document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos de programas desde el archivo JSON externo
    let programas = [];
    let facultadesData = {};

    // Elementos del DOM
    const programasContainer = document.getElementById('programas-container');
    const facultadFilter = document.getElementById('facultad-filter');
    const tipoFilter = document.getElementById('tipo-filter');
    const buscarInput = document.getElementById('buscar-programa');
    const cargarMasBtn = document.getElementById('cargar-mas');
    
    // Variables de estado
    let programasFiltrados = [];
    let programasMostrados = 6;
    const programasPorPagina = 6;

    // Inicializar la página
    function init() {
        fetch('data/programas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de programas');
                }
                return response.json();
            })
            .then(data => {
                facultadesData = data.facultades;
                
                // Convertir la estructura anidada a un array plano para compatibilidad
                programas = [];
                Object.keys(facultadesData).forEach(facultadId => {
                    const facultad = facultadesData[facultadId];
                    facultad.programas.forEach(programa => {
                        programas.push({
                            ...programa,
                            facultad: facultadId,
                            facultadNombre: facultad.nombre
                        });
                    });
                });
                
                programasFiltrados = [...programas];
                
                renderFacultadFilter();
                renderProgramas();
                setupEventListeners();
                setupStatsCounter();
                
                console.log('✅ Datos cargados:', programas.length, 'programas y', Object.keys(facultadesData).length, 'facultades');
            })
            .catch(error => {
                console.error('❌ Error al cargar programas:', error);
                programasContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3 text-warning"></i>
                        <h3 class="h4">No se pudieron cargar los programas</h3>
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
        facultadFilter.addEventListener('change', filtrarProgramas);
        tipoFilter.addEventListener('change', filtrarProgramas);
        buscarInput.addEventListener('input', filtrarProgramas);
        cargarMasBtn.addEventListener('click', cargarMasProgramas);
    }

    // Filtrar programas según los criterios seleccionados
    function filtrarProgramas() {
        const facultadSeleccionada = facultadFilter.value;
        const tipoSeleccionado = tipoFilter.value;
        const terminoBusqueda = buscarInput.value.toLowerCase().trim();

        programasFiltrados = programas.filter(programa => {
            // Filtro por facultad
            const cumpleFacultad = facultadSeleccionada === 'todos' || programa.facultad === facultadSeleccionada;
            
            // Filtro por tipo
            const cumpleTipo = tipoSeleccionado === 'todos' || programa.tipo === tipoSeleccionado;
            
            // Filtro por búsqueda de texto
            const cumpleBusqueda = terminoBusqueda === '' || 
                programa.nombre.toLowerCase().includes(terminoBusqueda) ||
                programa.descripcion.toLowerCase().includes(terminoBusqueda) ||
                programa.facultadNombre.toLowerCase().includes(terminoBusqueda);

            return cumpleFacultad && cumpleTipo && cumpleBusqueda;
        });

        // Reiniciar la paginación
        programasMostrados = programasPorPagina;
        renderProgramas();
        
        console.log(`🔍 Filtrados: ${programasFiltrados.length} programas de ${programas.length} totales`);
    }

    // Renderizar los programas en la página
    function renderProgramas() {
        if (!programasContainer) return;

        // Si no hay programas que mostrar
        if (programasFiltrados.length === 0) {
            programasContainer.innerHTML = `
                <div class="col-12">
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron programas</h3>
                        <p>Intenta modificar los filtros de búsqueda para encontrar programas que coincidan con tus criterios.</p>
                    </div>
                </div>
            `;
            cargarMasBtn.style.display = 'none';
            return;
        }

        // Obtener los programas a mostrar
        const programasAMostrar = programasFiltrados.slice(0, programasMostrados);
        
        // Limpiar el contenedor
        programasContainer.innerHTML = '';

        // Renderizar cada programa
        programasAMostrar.forEach((programa, index) => {
            const programaHTML = crearProgramaCard(programa, index);
            programasContainer.insertAdjacentHTML('beforeend', programaHTML);
        });

        // Controlar la visibilidad del botón "Cargar más"
        if (programasMostrados >= programasFiltrados.length) {
            cargarMasBtn.style.display = 'none';
        } else {
            cargarMasBtn.style.display = 'inline-block';
            cargarMasBtn.innerHTML = `
                <i class="fas fa-plus-circle me-2"></i>
                Cargar más programas (${programasFiltrados.length - programasMostrados} restantes)
            `;
        }

        console.log(`📄 Mostrando ${programasAMostrar.length} de ${programasFiltrados.length} programas`);
    }

    // Crear el HTML de una tarjeta de programa
    function crearProgramaCard(programa, index) {
        const tipoBadgeClass = programa.tipo === 'maestria' ? 'tipo-maestria' : 'tipo-doctorado';
        const tipoTexto = programa.tipo === 'maestria' ? 'Maestría' : 'Doctorado';
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <article class="programa-card" style="animation-delay: ${index * 0.1}s">
                    <div class="card-header">
                        <img src="${programa.imagen_1 || 'img/default-programa.jpg'}" 
                             alt="${programa.nombre}" 
                             class="card-image"
                             loading="lazy">
                        <div class="card-overlay"></div>
                        <span class="tipo-badge ${tipoBadgeClass}">${tipoTexto}</span>
                    </div>
                    <div class="card-body">
                        <div class="facultad-name">${programa.facultadNombre}</div>
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
                            <a href="admision/proceso_admision.html" class="btn-admision">
                                <i class="fas fa-user-plus me-2"></i>Postular
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    // Cargar más programas
    function cargarMasProgramas() {
        programasMostrados += programasPorPagina;
        renderProgramas();
    }

    // Configurar el contador de estadísticas
    function setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = parseInt(target.dataset.count);
                    animateCounter(target, finalNumber);
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }

    // Animar contador de estadísticas
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 40);
    }

    // Inicializar cuando el DOM esté listo
    init();

    // Smooth scroll para el botón hero
    document.querySelector('.btn-scroll-down')?.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('#programas-section');
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // Event listener para búsqueda en tiempo real con debounce
    let searchTimeout;
    buscarInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filtrarProgramas();
        }, 300);
    });

    console.log('🎓 Sistema de programas académicos inicializado correctamente');
});
