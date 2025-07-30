// Función para convertir texto en un "slug" amigable para URLs
function generarSlug(texto) {
    return texto
        .toString()
        .normalize("NFD")                   // Normaliza caracteres como tildes
        .replace(/[\u0300-\u036f]/g, "")    // Elimina diacríticos
        .toLowerCase()                      // Convierte a minúsculas
        .replace(/\s+/g, '-')               // Reemplaza espacios por guiones
        .replace(/[^\w\-]+/g, '')           // Elimina caracteres especiales
        .replace(/\-\-+/g, '-')             // Reemplaza múltiples guiones por uno solo
        .replace(/^-+/, '')                 // Elimina guiones al inicio
        .replace(/-+$/, '');                // Elimina guiones al final
}

document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const slug = parametros.get('nombre');
    if (!slug) return;

    fetch('data/programas.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            let encontrado = null;

            datos.forEach(facultadItem => {
                const facultadSlug = generarSlug(facultadItem.facultad);
                Object.keys(facultadItem).forEach(llave => {
                    if (llave !== "facultad" && Array.isArray(facultadItem[llave])) {
                        facultadItem[llave].forEach(programa => {
                            if (generarSlug(programa.nombre) === slug) {
                                const programaSlug = generarSlug(programa.nombre);
                                const rutaImagen = `./img/${facultadSlug}/${programaSlug}/`;

                                encontrado = {
                                    ...programa,
                                    tipo: llave,
                                    facultad: facultadItem.facultad,
                                    slug: programaSlug,
                                    rutaImagen: rutaImagen,
                                    imagen_1: programa.imagen_1 || rutaImagen + programaSlug + '_1.jpg',
                                    imagen_2: programa.imagen_2 || rutaImagen + programaSlug + '_2.jpg',
                                    imagen_3: programa.imagen_3 || rutaImagen + programaSlug + '_3.jpg'
                                };
                            }
                        });
                    }
                });
            });

            if (encontrado) {
                const imagenAlternativa = 'https://placehold.co/600x400/033a49/white?font=montserrat&text=Imagen+no+disponible';

                const crearEtiquetaImagen = (src, rutaAlternativa) => {
                    return `
                        <div class="img-wrapper">
                            <img src="${src}" alt="${encontrado.slug}" class="programa-img"
                                onerror="
                                    if (!this.dataset.errorCount) {
                                        this.dataset.errorCount = 1;
                                        this.src = '${rutaAlternativa}';
                                    } else {
                                        this.dataset.placeholder = 'true';
                                        this.src = '${imagenAlternativa}';
                                    }
                                "
                                onload="
                                    if (this.src.includes('placehold.co')) {
                                        this.dataset.placeholder = 'true';
                                        this.classList.add('placeholder-img');
                                        this.alt = 'Imagen no disponible';
                                    }
                                "
                            />
                            <img src="https://posgrado.unac.edu.pe/img/ep.png" class="logo-overlay" />
                        </div>
                    `;
                };

                const alternativa1 = `${encontrado.rutaImagen}${encontrado.slug}_1.jpg`;
                const alternativa2 = `${encontrado.rutaImagen}${encontrado.slug}_2.jpg`;
                const alternativa3 = `${encontrado.rutaImagen}${encontrado.slug}_3.jpg`;

                document.getElementById('program-title').textContent = encontrado.nombre;
                document.getElementById('program-detail').innerHTML = `
                    <p><strong>Facultad:</strong> ${encontrado.facultad}</p>
                    <p><strong>Tipo:</strong> ${encontrado.tipo}</p>
                    <p><strong>Descripción:</strong> ${encontrado.descripcion || '-'}</p>
                    <p><strong>Duración:</strong> ${encontrado.duracion || '-'}</p>
                    <p><strong>Modalidad:</strong> ${encontrado.modalidad || '-'}</p>
                    ${crearEtiquetaImagen(encontrado.imagen_1, alternativa1)}
                    ${crearEtiquetaImagen(encontrado.imagen_2, alternativa2)}
                    ${crearEtiquetaImagen(encontrado.imagen_3, alternativa3)}
                `;
            } else {
                document.getElementById('program-title').textContent = 'Programa no encontrado';
            }
        });
});
