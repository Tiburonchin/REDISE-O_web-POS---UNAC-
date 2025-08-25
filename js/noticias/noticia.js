// --- CARGA DINÁMICA DE NOTICIA POR ID ---
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function formatearFecha(fechaStr) {
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

function renderNoticiaDetalle(noticia) {
    const detalle = document.querySelector('article.card');
    if (!detalle || !noticia) return;
    const rutaImagen = noticia.imagen.startsWith('img/img-noticias/') ? noticia.imagen : 'img/img-noticias/' + noticia.imagen;
    detalle.innerHTML = `
        <span class="article-category">${noticia.categoria || 'General'}</span>
        <h1 class="article-title">${noticia.titulo}</h1>
        <p class="article-meta">Por: <span class="author-name">${noticia.creador || 'Desconocido'}</span> | <span class="publish-date">${formatearFecha(noticia.fecha)}</span></p>
        <img src="${rutaImagen}" alt="Imagen principal de la noticia" class="article-image">
        <div class="prose">
            <p>${noticia.contenido}</p>
        </div>
    `;
}

function incrementarContadorClic(id) {
    fetch('noticias-contador.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
}

function renderNoticiasRelacionadas(noticias, categoria, idPrincipal) {
    const lista = document.querySelectorAll('.aside .card .news-list')[0];
    if (!lista) return;
    let relacionadas = noticias.filter(n => n.categoria === categoria && n.id !== idPrincipal);
    // Si hay menos de 3 relacionadas, rellenar con aleatorias (sin repetir la principal ni duplicar)
    if (relacionadas.length < 3) {
        const faltantes = 3 - relacionadas.length;
        // Noticias que no sean la principal ni ya estén en relacionadas
        const restantes = noticias.filter(n => n.id !== idPrincipal && !relacionadas.some(r => r.id === n.id));
        const aleatorias = restantes.sort(() => Math.random() - 0.5).slice(0, faltantes);
        relacionadas = relacionadas.concat(aleatorias);
    }
    // Limitar a solo 3
    relacionadas = relacionadas.slice(0, 3);
    lista.innerHTML = relacionadas.map(n => {
        const rutaImagen = n.imagen.startsWith('img/') ? n.imagen : 'img/' + n.imagen;
        return `
        <li>
            <a class="news-item" href="noticia.html?id=${n.id}" data-id="${n.id}">
                <img src="${rutaImagen}" alt="${n.titulo}" class="news-item-image">
                <div class="news-item-content">
                    <span class="news-category">${n.categoria}</span>
                    <span class="news-title">${n.titulo}</span>
                    <span class="news-date">${formatearFecha(n.fecha)}</span>
                </div>
            </a>
        </li>
        `;
    }).join('');
    // Agregar evento para contador de clics
    lista.querySelectorAll('a.news-item').forEach(a => {
        a.addEventListener('click', function(e) {
            incrementarContadorClic(this.getAttribute('data-id'));
        });
    });
}

function renderNoticiasPopulares(noticias, idPrincipal) {
    const lista = document.querySelectorAll('.aside .card .news-list')[1];
    if (!lista) return;
    // Filtrar noticias con campo 'clics', excluir la principal
    let populares = noticias.filter(n => typeof n.clics === 'number' && n.id !== idPrincipal);
    // Ordenar por clics descendente y tomar las 4 más populares
    populares = populares.sort((a, b) => b.clics - a.clics).slice(0, 4);
    // Si no hay suficientes, completar con aleatorias
    if (populares.length < 4) {
        const faltantes = 4 - populares.length;
        const restantes = noticias.filter(n => n.id !== idPrincipal && !populares.includes(n));
        populares = populares.concat(restantes.sort(() => Math.random() - 0.5).slice(0, faltantes));
    }
    lista.innerHTML = populares.map(n => {
        const rutaImagen = n.imagen.startsWith('img/') ? n.imagen : 'img/' + n.imagen;
        return `
        <li>
            <a class="news-item" href="noticia.html?id=${n.id}" data-id="${n.id}">
                <img src="${rutaImagen}" alt="${n.titulo}" class="news-item-image">
                <div class="news-item-content">
                    <span class="news-category">${n.categoria}</span>
                    <span class="news-title">${n.titulo}</span>
                    <span class="news-date">${formatearFecha(n.fecha)}</span>
                </div>
            </a>
        </li>
        `;
    }).join('');
    // Agregar evento para contador de clics
    lista.querySelectorAll('a.news-item').forEach(a => {
        a.addEventListener('click', function(e) {
            incrementarContadorClic(this.getAttribute('data-id'));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar noticia por id si existe en la URL
    const noticiaId = getQueryParam('id');
    if (noticiaId) {
        fetch('noticias.json')
            .then(res => res.json())
            .then(data => {
                const idNum = parseInt(noticiaId, 10);
                const noticia = data.noticias.find(n => n.id === idNum);
                if (noticia) {
                    renderNoticiaDetalle(noticia);
                    renderNoticiasRelacionadas(data.noticias, noticia.categoria, noticia.id);
                    renderNoticiasPopulares(data.noticias, noticia.id);
                }
            });
    }

    // --- Comentarios (sin cambios) ---
    const commentInput = document.getElementById('comment-input');
    const submitCommentBtn = document.getElementById('submit-comment-btn');
    const commentsList = document.getElementById('comments-list');

    submitCommentBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            const user = 'Tú';
            const date = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            newComment.innerHTML = `
                <p class="comment-author">${user}</p>
                <p class="comment-date">${date}</p>
                <p class="comment-text">${commentText}</p>
            `;
            commentsList.prepend(newComment);
            commentInput.value = '';
        }
    });
});