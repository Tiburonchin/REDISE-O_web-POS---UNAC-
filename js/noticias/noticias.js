// Cargar noticias desde noticias.json y mostrarlas en la sección "Últimas Noticias" y la principal
fetch('noticias.json?v=2')
    .then(response => response.json())
    .then(data => {
        const noticias = data.noticias || [];
        const eventos = data.eventos || [];

        // --- NOTICIAS DESTACADAS ---
        // Leer IDs de noticias destacadas desde noticias.json (global)
        const idsDestacadas = Array.isArray(data.destacadas) ? data.destacadas.map(String) : [];
        // Filtrar y limitar a 3 noticias destacadas
        const noticiasDestacadas = noticias.filter(n => idsDestacadas.includes(n.id.toString())).slice(0, 3);
        // Renderizar en el slider-section
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.innerHTML = '';
        if (noticiasDestacadas.length > 0) {
            noticiasDestacadas.forEach((noticia, idx) => {
                const rutaImagen = noticia.imagen.startsWith('img/img-noticias/') ? noticia.imagen : 'img/img-noticias/' + noticia.imagen;
                const slide = document.createElement('div');
                slide.className = 'slider-item' + (idx === 0 ? ' active' : '');
                slide.innerHTML = `
                    <img class="slider-image" src="${rutaImagen}" alt="Imagen destacada">
                    <div class="slider-overlay">
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.contenido}</p>
                        <a class="slider-link" href="noticia.html?id=${noticia.id}">Ver más</a>
                    </div>
                `;
                sliderContainer.appendChild(slide);
            });
            // Slider automático
            let currentSlide = 0;
            const slides = sliderContainer.querySelectorAll('.slider-item');
            function showSlide(idx) {
                slides.forEach((s, i) => s.classList.toggle('active', i === idx));
            }
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 3500);
        } else {
            sliderContainer.innerHTML = '<div style="padding:2rem;text-align:center;color:#6b7280;">No hay noticias destacadas seleccionadas.</div>';
        }

        // --- NOTICIAS ---
        // Mostrar noticia principal (más clickeada)
        const principal = document.getElementById('noticia-principal');
        let noticiaDestacada = noticias[0];
        noticias.forEach(noticia => {
            if ((noticia.clics || 0) > (noticiaDestacada.clics || 0)) {
                noticiaDestacada = noticia;
            }
        });
        principal.innerHTML = `
            <img src="${noticiaDestacada.imagen.startsWith('img/img-noticias/') ? noticiaDestacada.imagen : 'img/img-noticias/' + noticiaDestacada.imagen}" alt="Noticia principal">
            <div class="featured-news-content">
                <span class="badge">${noticiaDestacada.categoria || 'General'}</span>
                <h3>${noticiaDestacada.titulo}</h3>
                <p class="meta">Por: ${noticiaDestacada.creador} | ${formatearFecha(noticiaDestacada.fecha)}</p>
                <p>${noticiaDestacada.contenido}</p>
                <a href="noticia.html?id=${noticiaDestacada.id}" class="slider-link" target="_blank">Leer noticia completa &rarr;</a>
            </div>
        `;

        // Mostrar las 3 noticias más leídas (excluyendo la principal)
        const masLeidasContenedor = document.querySelector('.aside-panel .news-list');
        let idsMasLeidas = [];
        if (masLeidasContenedor) {
            masLeidasContenedor.innerHTML = '';
            // Ordenar por clics descendente y excluir la principal
            const masLeidas = noticias
                .filter(noticia => noticia.id !== noticiaDestacada.id)
                .sort((a, b) => (b.clics || 0) - (a.clics || 0))
                .slice(0, 3);
            idsMasLeidas = masLeidas.map(n => n.id);
            masLeidas.forEach(noticia => {
                const li = document.createElement('li');
                li.className = 'news-item';
                const link = noticia.link ? noticia.link : `noticia.html?id=${noticia.id}`;
                li.innerHTML = `
                    <a href="${link}" data-id="${noticia.id}" target="_blank">
                        <img src="${noticia.imagen.startsWith('img/img-noticias/') ? noticia.imagen : 'img/img-noticias/' + noticia.imagen}" alt="Miniatura de noticia" style="width: 4rem; height: 4rem;">
                        <div>
                            <h4>${noticia.titulo}</h4>
                            <p class="meta">${(noticia.clics || 0)} lecturas</p>
                        </div>
                    </a>
                `;
                li.querySelector('a').addEventListener('click', function(e) {
                    e.preventDefault();
                    const noticiaId = noticia.id;
                    fetch('noticias-contador.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: noticiaId })
                    })
                    .finally(() => {
                        window.open(link, '_blank');
                    });
                });
                masLeidasContenedor.appendChild(li);
            });
        }

        // Mostrar solo las 6 noticias más recientes (excluyendo la principal y las más leídas)
        const contenedor = document.getElementById('noticias-dinamicas');
        contenedor.innerHTML = '';
        // Ordenar por fecha descendente
        const noticiasFiltradas = noticias
            .filter(noticia => noticia.id !== noticiaDestacada.id && !idsMasLeidas.includes(noticia.id))
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        let mostrar = 6;
        function renderNoticias(limit) {
            contenedor.innerHTML = '';
            noticiasFiltradas.slice(0, limit).forEach(noticia => {
                const li = document.createElement('li');
                li.className = 'news-item';
                // Si la noticia tiene un campo 'link', úsalo, si no, usa 'noticia.html'
                const link = noticia.link ? noticia.link : `noticia.html?id=${noticia.id}`;
                li.innerHTML = `
                    <a href="${link}" data-id="${noticia.id}" target="_blank">
                        <img src="${noticia.imagen.startsWith('img/img-noticias/') ? noticia.imagen : 'img/img-noticias/' + noticia.imagen}" alt="Miniatura de noticia">
                        <div>
                            <span class="category">${noticia.categoria || 'General'}</span>
                            <h4>${noticia.titulo}</h4>
                            <p class="meta">${formatearFecha(noticia.fecha)} | Por: ${noticia.creador}</p>
                        </div>
                    </a>
                `;
                // Evento click: aumentar contador y luego redirigir
                li.querySelector('a').addEventListener('click', function(e) {
                    e.preventDefault();
                    const noticiaId = noticia.id;
                    fetch('noticias-contador.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: noticiaId })
                    })
                    .finally(() => {
                        window.open(link, '_blank');
                    });
                });
                contenedor.appendChild(li);
            });
        }
        renderNoticias(mostrar);

        // Botón "ver más noticias"
        let btnVerMas = document.getElementById('btn-ver-mas-noticias');
        if (!btnVerMas) {
            btnVerMas = document.createElement('button');
            btnVerMas.id = 'btn-ver-mas-noticias';
            btnVerMas.textContent = 'Ver más noticias';
            btnVerMas.style.margin = '1rem auto 0 auto';
            btnVerMas.style.display = 'block';
            btnVerMas.style.padding = '0.5rem 1.5rem';
            btnVerMas.style.background = '#0d2c54';
            btnVerMas.style.color = '#fff';
            btnVerMas.style.border = 'none';
            btnVerMas.style.borderRadius = '0.5rem';
            btnVerMas.style.fontWeight = '600';
            btnVerMas.style.cursor = 'pointer';
        }
        if (noticiasFiltradas.length > mostrar) {
            contenedor.parentNode.appendChild(btnVerMas);
        } else if (btnVerMas.parentNode) {
            btnVerMas.parentNode.removeChild(btnVerMas);
        }

        btnVerMas.onclick = function() {
            mostrar += 6;
            renderNoticias(mostrar);
            if (mostrar >= noticiasFiltradas.length && btnVerMas.parentNode) {
                btnVerMas.parentNode.removeChild(btnVerMas);
            }
        };

        // --- EVENTOS ---
        // Renderizar eventos dinámicamente en la sección correspondiente
        const eventosContenedor = document.querySelectorAll('.aside-panel')[1]?.querySelector('.news-list');
        if (eventosContenedor) {
            eventosContenedor.innerHTML = '';
            eventos.forEach(evento => {
                // Extraer día y mes directamente del string para evitar desfase por zona horaria
                let dia = '';
                let mes = '';
                const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                if (typeof evento.fecha === 'string') {
                    const partes = evento.fecha.split('-');
                    if (partes.length === 3) {
                        dia = partes[2];
                        const mesNum = parseInt(partes[1], 10) - 1;
                        mes = meses[mesNum] || '';
                    }
                }
                const hora = evento.hora || '';
                const li = document.createElement('li');
                li.className = 'event-item';
                li.innerHTML = `
                    <div class="date-box">
                        <p class="day">${dia}</p>
                        <p class="month">${mes}</p>
                    </div>
                    <div>
                        <h4>${evento.titulo}</h4>
                        <p class="time">${hora}</p>
                    </div>
                `;
                eventosContenedor.appendChild(li);
            });
        }
    })
    .catch(error => {
        document.getElementById('noticias-dinamicas').innerHTML = '<li>Error al cargar las noticias.</li>';
        console.error('Error cargando noticias:', error);
    });

// Función para formatear la fecha a formato "d de mes, año"
function formatearFecha(fechaStr) {
    // Evita desfase de día/mes por zona horaria
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    if (!fechaStr || typeof fechaStr !== 'string') return fechaStr;
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return fechaStr;
    const anio = partes[0];
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);
    if (isNaN(mes) || isNaN(dia)) return fechaStr;
    return `${dia} de ${meses[mes]}, ${anio}`;
}

// Recargar la página al volver desde una noticia para mostrar los clics actualizados
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});