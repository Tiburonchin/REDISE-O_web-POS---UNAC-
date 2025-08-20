/**
 * DETALLE PROGRAMA PAGE - JAVASCRIPT
 * Funcionalidad para la página de detalle individual de programas de la Escuela de Posgrado UNAC
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let programaActual = null;
    let facultadesData = {};
    let todasLasImagenes = [];
    let miniaturaInicio = 0; // Índice de la primera miniatura visible

    // Elementos del DOM
    const programaTitulo = document.getElementById('programa-titulo');
    const programaDescripcion = document.getElementById('programa-descripcion');
    const programaDuracion = document.getElementById('programa-duracion');
    const programaModalidad = document.getElementById('programa-modalidad');
    const facultadBadge = document.getElementById('facultad-badge');
    const tipoBadge = document.getElementById('tipo-badge');
    const descripcionDetallada = document.getElementById('descripcion-detallada');
    // const breadcrumbPrograma = document.getElementById('breadcrumb-programa');
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
                
                // Buscar el programa por slug
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
        // Títulos y descripción
        programaTitulo.textContent = programa.nombre;
        programaDescripcion.textContent = programa.descripcion;
        descripcionDetallada.textContent = programa.descripcion_detallada;
        // Si existe el breadcrumb, actualiza el texto (por compatibilidad)
        // if (breadcrumbPrograma) breadcrumbPrograma.textContent = programa.nombre;

        // Información básica
        if (facultad.duracion && programa.tipo && facultad.duracion[programa.tipo]) {
            programaDuracion.textContent = facultad.duracion[programa.tipo];
        } else {
            programaDuracion.textContent = '-';
        }
        programaModalidad.textContent = facultad.modalidad || '-';
        
        // Badges
        facultadBadge.textContent = facultad.nombre;
        tipoBadge.textContent = programa.tipo === 'maestria' ? 'Maestría' : 'Doctorado';
        tipoBadge.className = programa.tipo === 'maestria' ? 'tipo-badge tipo-maestria' : 'tipo-badge tipo-doctorado';

        // Sidebar información
        sidebarTipo.textContent = programa.tipo === 'maestria' ? 'Maestría' : 'Doctorado';
        if (facultad.duracion && programa.tipo && facultad.duracion[programa.tipo]) {
            sidebarDuracion.textContent = facultad.duracion[programa.tipo];
        } else {
            sidebarDuracion.textContent = '-';
        }
        sidebarModalidad.textContent = facultad.modalidad || '-';
        sidebarFacultad.textContent = facultad.nombre;

        // Contacto dinámico de la facultad
        if (contactCorreo && facultad.correo) {
            contactCorreo.textContent = facultad.correo;
            contactCorreo.href = 'mailto:' + facultad.correo;
        }
        if (contactTelefono && facultad.telefono) {
            contactTelefono.textContent = facultad.telefono;
            contactTelefono.href = 'tel:' + facultad.telefono.replace(/[^\d+]/g, '');
        }

        // Configurar galería de imágenes
        configurarGaleria(programa);

        // Actualizar imagen de fondo del hero
        if (programa.imagen_1) {
            heroImageBg.src = programa.imagen_1;
            heroImageBg.alt = `Imagen de ${programa.nombre}`;
        }

        console.log('✅ Programa renderizado:', programa.nombre);
    }

    // Configurar la galería de imágenes
    function configurarGaleria(programa) {
        // Usar array 'imagenes' si existe, si no, buscar imagen_N
        if (Array.isArray(programa.imagenes)) {
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

        miniaturaInicio = 0;

        // Si no hay imágenes, salir
        if (todasLasImagenes.length === 0) return;

        // Configurar imagen principal
        imagenPrincipal.src = todasLasImagenes[0];
        imagenPrincipal.alt = `Imagen principal de ${programa.nombre}`;

        renderizarMiniaturas();
    }

    function renderizarMiniaturas() {
        miniaturasContainer.innerHTML = '';
        const total = todasLasImagenes.length;
        // Detectar si la pantalla es <= 425px
        const isMobile = window.matchMedia('(max-width: 425px)').matches;
        const maxVisibles = isMobile ? 1 : 3;

        // Botón retroceder
        if (total > maxVisibles && miniaturaInicio > 0) {
            const btnPrev = document.createElement('button');
            btnPrev.innerHTML = '←';
            btnPrev.className = 'btn-miniatura-nav btn-miniatura-prev';
            btnPrev.onclick = function() {
                miniaturaInicio = Math.max(0, miniaturaInicio - 1);
                renderizarMiniaturas();
            };
            miniaturasContainer.appendChild(btnPrev);
        }

        // Miniaturas visibles
        for (let idx = miniaturaInicio; idx < Math.min(miniaturaInicio + maxVisibles, total); idx++) {
            const thumb = document.createElement('img');
            thumb.src = todasLasImagenes[idx];
            thumb.alt = `Imagen ${idx + 1}`;
            thumb.className = 'img-thumbnail' + (imagenPrincipal.src === todasLasImagenes[idx] ? ' active' : '');
            thumb.dataset.index = idx;
            thumb.style.cursor = 'pointer';
            miniaturasContainer.appendChild(thumb);
        }

        // Botón avanzar
        if (total > maxVisibles && miniaturaInicio + maxVisibles < total) {
            const btnNext = document.createElement('button');
            btnNext.innerHTML = '→';
            btnNext.className = 'btn-miniatura-nav btn-miniatura-next';
            btnNext.onclick = function() {
                miniaturaInicio = Math.min(total - maxVisibles, miniaturaInicio + 1);
                renderizarMiniaturas();
            };
            miniaturasContainer.appendChild(btnNext);
        }
    }
// Redibujar miniaturas al cambiar el tamaño de la pantalla
window.addEventListener('resize', function() {
    renderizarMiniaturas();
});

    // Configurar event listeners para la galería
    function configurarEventListenersGaleria() {
        // Delegar el evento click a las miniaturas generadas dinámicamente
        miniaturasContainer.addEventListener('click', function(e) {
            if (e.target && e.target.tagName === 'IMG') {
                const idx = parseInt(e.target.dataset.index);
                if (!isNaN(idx) && todasLasImagenes[idx]) {
                    imagenPrincipal.src = todasLasImagenes[idx];
                    renderizarMiniaturas();
                }
            }
        });

        // Click en imagen principal para abrir modal
        imagenPrincipal.addEventListener('click', function() {
            const currentSrc = imagenPrincipal.src;
            modalImagen.src = currentSrc;
            modalTitulo.textContent = programaActual ? programaActual.nombre : 'Imagen del programa';
            const modal = new bootstrap.Modal(document.getElementById('imagenModal'));
            modal.show();
        });
    }
    // Estilos mínimos para los botones de navegación de miniaturas
    const style = document.createElement('style');
    style.innerHTML = `
        .btn-miniatura-nav {
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            margin: 0 4px;
            font-size: 18px;
            cursor: pointer;
            vertical-align: middle;
            transition: background 0.2s;
        }
        .btn-miniatura-nav:hover {
            background: #e0e0e0;
        }
        .imagenes-miniatura {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `;
    document.head.appendChild(style);

    // Cargar programas relacionados
    function cargarProgramasRelacionados(facultadActual, programaActualId) {
        const container = document.getElementById('programas-relacionados-container');
        let programasRelacionados = [];

        // Obtener programas de la misma facultad (excluyendo el actual)
        facultadActual.programas.forEach(programa => {
            if (programa.id !== programaActualId) {
                programasRelacionados.push({
                    ...programa,
                    facultadNombre: facultadActual.nombre
                });
            }
        });

        // Si no hay suficientes, agregar de otras facultades
        if (programasRelacionados.length < 3) {
            Object.keys(facultadesData).forEach(facultadId => {
                const facultad = facultadesData[facultadId];
                if (facultad !== facultadActual) {
                    facultad.programas.forEach(programa => {
                        if (programasRelacionados.length < 3) {
                            programasRelacionados.push({
                                ...programa,
                                facultadNombre: facultad.nombre
                            });
                        }
                    });
                }
            });
        }

        // Limitar a 3 programas
        programasRelacionados = programasRelacionados.slice(0, 3);

        // Renderizar programas relacionados
        container.innerHTML = '';
        programasRelacionados.forEach(programa => {
            const programaHTML = crearProgramaCardRelacionado(programa);
            container.insertAdjacentHTML('beforeend', programaHTML);
        });
    }

    // Crear tarjeta de programa relacionado
    function crearProgramaCardRelacionado(programa) {
        const tipoBadgeClass = programa.tipo === 'maestria' ? 'tipo-maestria' : 'tipo-doctorado';
        const tipoTexto = programa.tipo === 'maestria' ? 'Maestría' : 'Doctorado';
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <article class="programa-card">
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

    // Actualizar SEO dinámicamente
    function actualizarSEO(programa) {
        // Actualizar título de la página
        document.title = `${programa.nombre} - Escuela de Posgrado UNAC`;
        
        // Actualizar meta description
        const metaDescription = document.getElementById('page-description');
        if (metaDescription) {
            metaDescription.setAttribute('content', `${programa.descripcion} - ${programa.descripcion_detallada.substring(0, 120)}...`);
        }

        // Actualizar Open Graph
        const ogTitle = document.getElementById('og-title');
        const ogDescription = document.getElementById('og-description');
        const ogImage = document.getElementById('og-image');
        
        if (ogTitle) ogTitle.setAttribute('content', `${programa.nombre} - Escuela de Posgrado UNAC`);
        if (ogDescription) ogDescription.setAttribute('content', programa.descripcion);
        if (ogImage && programa.imagen_1) ogImage.setAttribute('content', programa.imagen_1);

        // Actualizar Twitter Card
        const twitterTitle = document.getElementById('twitter-title');
        const twitterDescription = document.getElementById('twitter-description');
        const twitterImage = document.getElementById('twitter-image');
        
        if (twitterTitle) twitterTitle.setAttribute('content', `${programa.nombre} - Escuela de Posgrado UNAC`);
        if (twitterDescription) twitterDescription.setAttribute('content', programa.descripcion);
        if (twitterImage && programa.imagen_1) twitterImage.setAttribute('content', programa.imagen_1);
    }

    // Mostrar mensaje de error
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

    // Smooth scroll para navegación
    function configurarSmoothScroll() {
        const btnScrollDown = document.querySelector('.btn-scroll-down');
        if (btnScrollDown) {
            btnScrollDown.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Inicializar la página
    function init() {
        cargarDatosPrograma();
        configurarEventListenersGaleria();
        configurarSmoothScroll();
        
        console.log('🎓 Sistema de detalle de programa inicializado correctamente');
    }

    // Inicializar cuando el DOM esté listo
    init();
});
