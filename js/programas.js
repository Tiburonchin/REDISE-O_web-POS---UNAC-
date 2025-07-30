// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    fetch('data/programas.json')
        .then(respuesta => respuesta.json())
        .then(datos => inicializarSelectores(datos))
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

// Variable global para guardar las facultades
let facultadesGlobales = [];

// Función para inicializar los selectores de Facultad y Tipo
function inicializarSelectores(facultades) {
    facultadesGlobales = facultades;

    const selectorFacultad = document.getElementById('facultad-select');
    const selectorTipo = document.getElementById('tipo-select');
    const listaProgramas = document.getElementById('program-list');

    // Inicializa el selector de Facultades
    selectorFacultad.length = 1;
    const opcionTodasFacultades = document.createElement('option');
    opcionTodasFacultades.textContent = 'Todas las Facultades';
    opcionTodasFacultades.value = '';
    selectorFacultad.appendChild(opcionTodasFacultades);

    facultades.forEach(facultad => {
        const opcion = document.createElement('option');
        opcion.textContent = facultad.facultad;
        opcion.value = facultad.facultad;
        selectorFacultad.appendChild(opcion);
    });

    // Inicializa el selector de Tipos (Maestría, Doctorado, etc.)
    selectorTipo.length = 1;
    const opcionTodosTipos = document.createElement('option');
    opcionTodosTipos.textContent = 'Todos los Tipos';
    opcionTodosTipos.value = '';
    selectorTipo.appendChild(opcionTodosTipos);

    const tiposUnicos = new Set();
    facultades.forEach(facultad => {
        Object.keys(facultad).forEach(clave => {
            if (clave !== "facultad" && Array.isArray(facultad[clave]) && facultad[clave].length > 0) {
                tiposUnicos.add(clave);
            }
        });
    });

    tiposUnicos.forEach(tipo => {
        const opcion = document.createElement('option');
        opcion.textContent = tipo;
        opcion.value = tipo;
        selectorTipo.appendChild(opcion);
    });

    selectorTipo.disabled = false;

    // Mostrar todos los programas por defecto
    mostrarProgramas(obtenerTodosLosProgramas(facultades));

    // Evento al cambiar Facultad
    selectorFacultad.addEventListener('change', () => {
        filtrarYMostrar();
    });

    // Evento al cambiar Tipo
    selectorTipo.addEventListener('change', () => {
        filtrarYMostrar();
    });

    // Función para aplicar los filtros y mostrar programas
    function filtrarYMostrar() {
        const facultadSeleccionada = selectorFacultad.value;
        const tipoSeleccionado = selectorTipo.value;
        let programasFiltrados = [];

        if (facultadSeleccionada && tipoSeleccionado) {
            // Filtrar por ambos
            const facultad = facultades.find(f => f.facultad === facultadSeleccionada);
            if (facultad && Array.isArray(facultad[tipoSeleccionado])) {
                programasFiltrados = facultad[tipoSeleccionado];
            }
        } else if (facultadSeleccionada) {
            // Solo por facultad
            const facultad = facultades.find(f => f.facultad === facultadSeleccionada);
            if (facultad) {
                Object.keys(facultad).forEach(clave => {
                    if (clave !== "facultad" && Array.isArray(facultad[clave])) {
                        programasFiltrados = programasFiltrados.concat(facultad[clave]);
                    }
                });
            }
        } else if (tipoSeleccionado) {
            // Solo por tipo
            facultades.forEach(facultad => {
                if (Array.isArray(facultad[tipoSeleccionado])) {
                    programasFiltrados = programasFiltrados.concat(facultad[tipoSeleccionado]);
                }
            });
        } else {
            // Sin filtros
            programasFiltrados = obtenerTodosLosProgramas(facultades);
        }

        mostrarProgramas(programasFiltrados);
    }
}

// Función que retorna todos los programas sin filtros
function obtenerTodosLosProgramas(facultades) {
    let todos = [];
    facultades.forEach(facultad => {
        Object.keys(facultad).forEach(clave => {
            if (clave !== "facultad" && Array.isArray(facultad[clave])) {
                todos = todos.concat(facultad[clave]);
            }
        });
    });
    return todos;
}

// Función que muestra los programas en el contenedor
function mostrarProgramas(programas) {
    const contenedor = document.getElementById('program-list');
    contenedor.innerHTML = '';

    if (programas && programas.length > 0) {
        programas.forEach(programa => {
            const div = document.createElement('div');
            div.className = 'programa-item';

            const url = `detalle_programa.html?nombre=${encodeURIComponent(programa.slug)}`;
            div.style.cursor = 'pointer';

            div.innerHTML = `
                <h3>${programa.nombre}</h3>
                <div>
                    <span class="programa-duracion"><strong>Duración:</strong> ${programa.duracion || 'No especificada'}</span>
                    <span class="programa-modalidad"><strong>Modalidad:</strong> ${programa.modalidad || 'No especificada'}</span>
                </div>
            `;

            div.addEventListener('click', () => {
                window.location.href = url;
            });

            contenedor.appendChild(div);
        });
    } else {
        contenedor.innerHTML = '<li>No hay programas disponibles.</li>';
    }
}
