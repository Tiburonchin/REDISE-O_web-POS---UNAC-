/**
 * DETALLE PROGRAMA PAGE - JAVASCRIPT
 * Funcionalidad para la página de detalle individual de programas de la Escuela de Posgrado UNAC
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let programaActual = null;
    let facultadesData = {};
    let todasLasImagenes = [];

    // Elementos del DOM
    const programaTitulo = document.getElementById('programa-titulo');
    const programaDescripcion = document.getElementById('programa-descripcion');
    const programaDuracion = document.getElementById('programa-duracion');
    const programaModalidad = document.getElementById('programa-modalidad');
    const facultadBadge = document.getElementById('facultad-badge');
    const tipoBadge = document.getElementById('tipo-badge');
    const descripcionDetallada = document.getElementById('descripcion-detallada');
    const heroImageBg = document.getElementById('hero-bg-image');

    // Sidebar elements
    const sidebarTipo = document.getElementById('sidebar-tipo');
    const sidebarDuracion = document.getElementById('sidebar-duracion');
    const sidebarModalidad = document.getElementById('sidebar-modalidad');
    const sidebarFacultad = document.getElementById('sidebar-facultad');
    // Contact info elements
    const contactCorreo = document.getElementById('contact-correo');
    const contactTelefono = document.getElementById('contact-telefono');

    // Galería elements
    const imagenPrincipal = document.getElementById('imagen-principal');
    const miniaturasContainer = document.getElementById('imagenes-miniatura');

    // Modal elements
    const modalImagen = document.getElementById('modal-imagen');
    const modalTitulo = document.getElementById('modal-titulo');

    // Obtener el slug del programa desde la URL
    function obtenerSlugDeURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('slug');
    }

    // Cargar datos del programa
    function cargarDatosPrograma() {
        const slug = obtenerSlugDeURL();
        
        if (!slug) {
            mostrarError('No se especificó un programa válido');
            return;
        }

        fetch('data/programas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de programas');
                }
                return response.json();
            })
            .then(data => {
                facultadesData = data.facultades;
                
                let programaEncontrado = null;
                let facultadDelPrograma = null;

                Object.keys(facultadesData).forEach(facultadId => {
                    const facultad = facultadesData[facultadId];
                    const programa = facultad.programas.find(p => p.slug === slug);
                    if (programa) {
                        programaEncontrado = programa;
                        facultadDelPrograma = facultad;
                        programa.facultad = facultadId;
                        programa.facultadNombre = facultad.nombre;
                    }
                });

                if (programaEncontrado) {
                    programaActual = programaEncontrado;
                    renderizarPrograma(programaEncontrado, facultadDelPrograma);
                    cargarProgramasRelacionados(facultadDelPrograma, programaEncontrado.id);
                    actualizarSEO(programaEncontrado);
                } else {
                    mostrarError('Programa no encontrado');
                }
            })
            .catch(error => {
                console.error('Error al cargar programa:', error);
                mostrarError('Error al cargar los datos del programa');
            });
    }

    // Renderizar la información del programa
    function renderizarPrograma(programa, facultad) {
        programaTitulo.textContent = programa.nombre;
        programaDescripcion.textContent = programa.descripcion;
        descripcionDetallada.textContent = programa.descripcion_detallada;

        // Usar información del sidebar si existe (nueva estructura), sino fallback a la antigua
        if (programa.sidebar) {
            programaDuracion.textContent = programa.sidebar.duracion || '-';
            programaModalidad.textContent = programa.sidebar.modalidad || '-';
            sidebarTipo.textContent = programa.sidebar.tipo || '-';
            sidebarDuracion.textContent = programa.sidebar.duracion || '-';
            sidebarModalidad.textContent = programa.sidebar.modalidad || '-';
            sidebarFacultad.textContent = programa.sidebar.facultad || '-';
        } else {
            // Fallback para estructura antigua
            if (facultad.duracion && programa.tipo && facultad.duracion[programa.tipo]) {
                programaDuracion.textContent = facultad.duracion[programa.tipo];
            } else {
                programaDuracion.textContent = '-';
            }
            programaModalidad.textContent = facultad.modalidad || '-';

            sidebarTipo.textContent = programa.tipo === 'maestria' ? 'Maestría' : programa.tipo === 'doctorado' ? 'Doctorado' : 'Especialidad';
            if (facultad.duracion && programa.tipo && facultad.duracion[programa.tipo]) {
                sidebarDuracion.textContent = facultad.duracion[programa.tipo];
            } else {
                sidebarDuracion.textContent = '-';
            }
            sidebarModalidad.textContent = facultad.modalidad || '-';
            sidebarFacultad.textContent = facultad.nombre;
        }

        facultadBadge.textContent = facultad.nombre;
        tipoBadge.textContent = programa.sidebar ? programa.sidebar.tipo : (programa.tipo === 'maestria' ? 'Maestría' : programa.tipo === 'doctorado' ? 'Doctorado' : 'Especialidad');
        tipoBadge.className = programa.tipo === 'maestria' ? 'tipo-badge tipo-maestria' : programa.tipo === 'doctorado' ? 'tipo-badge tipo-doctorado' : 'tipo-badge tipo-especialidad';

        // Información de contacto - usar nueva estructura si existe
        const contacto = facultad.contacto || facultad;
        if (contactCorreo && contacto.correo) {
            contactCorreo.textContent = contacto.correo;
            contactCorreo.href = 'mailto:' + contacto.correo;
        }
        if (contactTelefono && contacto.telefono) {
            contactTelefono.textContent = contacto.telefono;
            contactTelefono.href = 'tel:' + contacto.telefono.replace(/[^\d+]/g, '');
        }

        configurarGaleria(programa);

        // Imagen del hero - usar nueva estructura si existe
        const imagenHero = programa.imagenes ? programa.imagenes.principal : programa.imagen_1;
        if (imagenHero) {
            heroImageBg.src = imagenHero;
            heroImageBg.alt = `Imagen de ${programa.nombre}`;
        }

        console.log('✅ Programa renderizado:', programa.nombre);

        // Generar plan de estudios dinámico según tipo
        generarPlanDeEstudios(programa);
    }

    // Configurar la galería de imágenes
    function configurarGaleria(programa) {
        // Nueva estructura: programa.imagenes.galeria
        if (programa.imagenes && programa.imagenes.galeria) {
            todasLasImagenes = programa.imagenes.galeria.filter(img => img && img.trim() !== '');
        }
        // Estructura antigua: programa.imagen_1, imagen_2, etc.
        else if (Array.isArray(programa.imagenes)) {
            todasLasImagenes = programa.imagenes.filter(img => img && img.trim() !== '');
        } else {
            todasLasImagenes = [];
            let i = 1;
            while (programa[`imagen_${i}`]) {
                const url = programa[`imagen_${i}`];
                if (url && url.trim() !== '') {
                    todasLasImagenes.push(url);
                }
                i++;
            }
        }

        if (todasLasImagenes.length === 0) {
            document.querySelector('.galeria-programa').style.display = 'none';
            return;
        }

        imagenPrincipal.src = todasLasImagenes[0];
        imagenPrincipal.alt = `Imagen principal de ${programa.nombre}`;

        renderizarMiniaturas();
    }

    function renderizarMiniaturas() {
        if (!miniaturasContainer) return;
        miniaturasContainer.innerHTML = '';

        todasLasImagenes.forEach((imagenUrl, idx) => {
            const item = document.createElement('div');
            item.className = 'miniatura-item';
            if (imagenPrincipal.src.includes(encodeURI(imagenUrl))) {
                item.classList.add('active');
            }
            item.dataset.index = idx;

            const thumb = document.createElement('img');
            thumb.src = imagenUrl;
            thumb.alt = `Imagen ${idx + 1}`;
            thumb.className = 'img-thumbnail';
            
            item.appendChild(thumb);
            miniaturasContainer.appendChild(item);
        });
    }

    // Construye dinámicamente los tabs de semestres y contenidos
    function generarPlanDeEstudios(programa) {
        const contenedorTabs = document.getElementById('semestres-tabs');
        const contenedorContenido = document.getElementById('semestres-content');
        if (!contenedorTabs || !contenedorContenido) return;

        // Determinar cantidad de semestres por tipo
        let cantidadSemestres = 3; // default maestría
        const tipo = (programa.sidebar?.tipo || (programa.tipo === 'maestria' ? 'Maestría' : programa.tipo === 'doctorado' ? 'Doctorado' : 'Especialidad')).toLowerCase();
        if (tipo.includes('doctor')) cantidadSemestres = 6;
        else if (tipo.includes('especial')) cantidadSemestres = 2;
        else cantidadSemestres = 3;

        // Si el JSON trae un plan explícito, podríamos usarlo. Por ahora, generamos ejemplo.
        const cursosEjemploPorSemestre = (idx) => [
            `Curso ${idx*3-2}: Fundamentos de la especialidad`,
            `Curso ${idx*3-1}: Métodos y herramientas aplicadas`,
            `Curso ${idx*3}: Seminario/Taller ${idx}`
        ];

        // Limpiar contenido inicial del HTML
        contenedorTabs.innerHTML = '';
        contenedorContenido.innerHTML = '';

        for (let i = 1; i <= cantidadSemestres; i++) {
            const active = i === 1 ? 'active' : '';
            const selected = i === 1 ? 'true' : 'false';

            // Tab button
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.setAttribute('role', 'presentation');
            li.innerHTML = `
                <button class="nav-link ${active}" id="semestre${i}-tab" data-bs-toggle="pill" data-bs-target="#semestre${i}" type="button" role="tab" aria-controls="semestre${i}" aria-selected="${selected}">Semestre ${i}</button>
            `;
            contenedorTabs.appendChild(li);

            // Content pane
            const pane = document.createElement('div');
            pane.className = `tab-pane fade ${active ? 'show active' : ''}`;
            pane.id = `semestre${i}`;
            pane.setAttribute('role', 'tabpanel');
            pane.setAttribute('aria-labelledby', `semestre${i}-tab`);

            const cursos = cursosEjemploPorSemestre(i);
            pane.innerHTML = `
                <ul class="plan-list">
                    ${cursos.map(c => `<li>${c}</li>`).join('')}
                </ul>
            `;
            contenedorContenido.appendChild(pane);
        }

        // Scroll suave al inicio de la sección Plan (opcional)
        // document.getElementById('pane-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Configurar event listeners para la galería
    function configurarEventListenersGaleria() {
        if (!miniaturasContainer) return;

        miniaturasContainer.addEventListener('click', function(e) {
            const item = e.target.closest('.miniatura-item');
            if (item) {
                const idx = parseInt(item.dataset.index);
                if (!isNaN(idx) && todasLasImagenes[idx]) {
                    
                    imagenPrincipal.classList.add('fade-out');

                    setTimeout(() => {
                        imagenPrincipal.src = todasLasImagenes[idx];
                        
                        miniaturasContainer.querySelectorAll('.miniatura-item').forEach(el => {
                            el.classList.remove('active');
                        });
                        item.classList.add('active');

                        // Esperar a que la nueva imagen cargue para hacer el fade in
                        imagenPrincipal.onload = () => {
                            imagenPrincipal.classList.remove('fade-out');
                        }
                    }, 400); // Duración de la animación de fade-out
                }
            }
        });

        imagenPrincipal.addEventListener('click', function() {
            if (!imagenPrincipal.src) return;
            modalImagen.src = imagenPrincipal.src;
            modalTitulo.textContent = programaActual ? programaActual.nombre : 'Imagen del programa';
            const modal = new bootstrap.Modal(document.getElementById('imagenModal'));
            modal.show();
        });
    }

    // Cargar programas relacionados
    function cargarProgramasRelacionados(facultadActual, programaActualId) {
        const container = document.getElementById('programas-relacionados-container');
        if (!container) return;
        let programasRelacionados = [];

        facultadActual.programas.forEach(programa => {
            if (programa.id !== programaActualId) {
                programasRelacionados.push({
                    ...programa,
                    facultadNombre: facultadActual.nombre
                });
            }
        });

        if (programasRelacionados.length < 3) {
            const facultadesDisponibles = Object.keys(facultadesData).filter(id => id !== facultadActual.id);
            for (const facultadId of facultadesDisponibles) {
                const facultad = facultadesData[facultadId];
                for (const programa of facultad.programas) {
                    if (programasRelacionados.length < 3 && !programasRelacionados.some(p => p.id === programa.id)) {
                        programasRelacionados.push({
                            ...programa,
                            facultadNombre: facultad.nombre
                        });
                    }
                }
            }
        }

        container.innerHTML = '';
        programasRelacionados.slice(0, 3).forEach(programa => {
            const programaHTML = crearProgramaCardRelacionado(programa);
            container.insertAdjacentHTML('beforeend', programaHTML);
        });
    }

    function crearProgramaCardRelacionado(programa) {
        const tipoBadgeClass = programa.tipo === 'maestria' ? 'tipo-maestria' : programa.tipo === 'doctorado' ? 'tipo-doctorado' : 'tipo-especialidad';
        const tipoTexto = programa.sidebar ? programa.sidebar.tipo : (programa.tipo === 'maestria' ? 'Maestría' : programa.tipo === 'doctorado' ? 'Doctorado' : 'Especialidad');

        // Determinar imagen principal
        let imagenSrc = 'img/default-programa.jpg';
        if (programa.imagenes && programa.imagenes.principal) {
            imagenSrc = programa.imagenes.principal;
        } else if (programa.imagen_1) {
            imagenSrc = programa.imagen_1;
        }

        // Determinar duración y modalidad
        let duracion = 'N/A';
        let modalidad = 'N/A';

        if (programa.sidebar) {
            duracion = programa.sidebar.duracion || 'N/A';
            modalidad = programa.sidebar.modalidad || 'N/A';
        } else if (programa.duracion) {
            duracion = programa.duracion;
        } else if (programa.facultad && facultadesData[programa.facultad] && facultadesData[programa.facultad].duracion && facultadesData[programa.facultad].duracion[programa.tipo]) {
            duracion = facultadesData[programa.facultad].duracion[programa.tipo];
            modalidad = facultadesData[programa.facultad].modalidad || 'N/A';
        }

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <article class="programa-card">
                    <div class="card-header">
                        <img src="${imagenSrc}"
                             alt="${programa.nombre}"
                             class="card-image"
                             loading="lazy">
                        <div class="card-overlay"></div>
                        <span class="tipo-badge ${tipoBadgeClass}">${tipoTexto}</span>
                    </div>
                    <div class="card-body">
                        <div class="facultad-name">${programa.facultadNombre || programa.sidebar?.facultad || 'Facultad'}</div>
                        <h3 class="programa-title">${programa.nombre}</h3>
                        <p class="programa-description">${programa.descripcion}</p>

                        <div class="programa-details">
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${duracion}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${modalidad}</span>
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

    function actualizarSEO(programa) {
        document.title = `${programa.nombre} - Escuela de Posgrado UNAC`;
        
        const metaDescription = document.getElementById('page-description');
        if (metaDescription) {
            metaDescription.setAttribute('content', `${programa.descripcion} - ${programa.descripcion_detallada.substring(0, 120)}...`);
        }

        const ogTitle = document.getElementById('og-title');
        const ogDescription = document.getElementById('og-description');
        const ogImage = document.getElementById('og-image');
        
        if (ogTitle) ogTitle.setAttribute('content', `${programa.nombre} - Escuela de Posgrado UNAC`);
        if (ogDescription) ogDescription.setAttribute('content', programa.descripcion);
        if (ogImage && programa.imagen_1) ogImage.setAttribute('content', new URL(programa.imagen_1, window.location.href).href);

        const twitterTitle = document.getElementById('twitter-title');
        const twitterDescription = document.getElementById('twitter-description');
        const twitterImage = document.getElementById('twitter-image');
        
        if (twitterTitle) twitterTitle.setAttribute('content', `${programa.nombre} - Escuela de Posgrado UNAC`);
        if (twitterDescription) twitterDescription.setAttribute('content', programa.descripcion);
        if (twitterImage && programa.imagen_1) twitterImage.setAttribute('content', new URL(programa.imagen_1, window.location.href).href);
    }

    function mostrarError(mensaje) {
        const main = document.querySelector('.main-content');
        main.innerHTML = `
            <div class="container py-5">
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar el programa</h3>
                    <p>${mensaje}</p>
                    <a href="programas.html" class="btn btn-primary mt-3">
                        <i class="fas fa-arrow-left me-2"></i>Volver a programas
                    </a>
                </div>
            </div>
        `;
    }

    function configurarSmoothScroll() {
        const btnScrollDown = document.querySelector('.btn-scroll-down');
        if (btnScrollDown) {
            btnScrollDown.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    function init() {
        cargarDatosPrograma();
        configurarEventListenersGaleria();
        configurarSmoothScroll();
        
        console.log('🎓 Sistema de detalle de programa inicializado correctamente');
    }

    init();
});