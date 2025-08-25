document.addEventListener('DOMContentLoaded', function () {
    // Elementos principales
    const facultadSelect = document.getElementById('facultad');
    const programaSelect = document.getElementById('programa');
    const tiposProgramaDiv = document.getElementById('tiposPrograma');
    const programaContainer = document.getElementById('programaContainer');
    const subidaSection = document.getElementById('subidaSection');
    let facultadesData = {};

    // Cargar programas.json y poblar facultades
    fetch('./config/programas_detalle_programa.json')
        .then(response => response.json())
        .then(data => {
            facultadesData = data;
            facultadSelect.innerHTML = '<option value="">Seleccione una facultad</option>';
            Object.keys(facultadesData).forEach(facultad => {
                const option = document.createElement('option');
                option.value = facultad;
                option.textContent = facultad;
                facultadSelect.appendChild(option);
            });
        })
        .catch(() => {
            facultadSelect.innerHTML = '<option value="">Error al cargar facultades</option>';
        });

    // Al cambiar facultad, mostrar botones de tipo de programa y limpiar selects
    facultadSelect.addEventListener('change', function () {
        tiposProgramaDiv.innerHTML = '';
        programaSelect.innerHTML = '<option value="">Seleccione un programa</option>';
        programaContainer.style.display = 'none';

        const tipos = facultadesData[this.value];
        const tiposOrden = ['Maestría', 'Doctorado', 'Especialidad'];

        tiposOrden.forEach(tipo => {
            const tieneProgramas = tipos && Array.isArray(tipos[tipo]) && tipos[tipo].length > 0;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn me-2 mb-2 ' + (tieneProgramas ? 'btn-outline-primary' : 'btn-outline-secondary disabled');
            btn.textContent = tipo;
            btn.disabled = !tieneProgramas;
            btn.onclick = function () {
                if (!tieneProgramas) return;
                // Quitar la clase activa de todos los botones
                Array.from(tiposProgramaDiv.querySelectorAll('button')).forEach(b => b.classList.remove('active-programa'));
                // Marcar este como activo
                btn.classList.add('active-programa');
                // Llenar el select de programas específicos
                programaSelect.innerHTML = '<option value="">Seleccione un programa</option>';
                tipos[tipo].forEach(prog => {
                    const option = document.createElement('option');
                    option.value = prog;
                    option.textContent = prog;
                    programaSelect.appendChild(option);
                });
                programaContainer.style.display = '';
            };
            tiposProgramaDiv.appendChild(btn);
        });
    });

    // Buscar postulante por DNI, facultad y programa
    document.getElementById('buscarForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const dni = document.getElementById('dni').value.trim();
        const programa = programaSelect.value;
        const respuestaDiv = document.getElementById('respuesta');
        const buscarBtn = this.querySelector('button[type="submit"]');
        const spinnerBuscar = document.getElementById('spinnerBuscar');
        if (buscarBtn) buscarBtn.disabled = true;
        if (spinnerBuscar) spinnerBuscar.classList.remove('d-none');

        if (!dni.match(/^\d{8}$/)) {
            respuestaDiv.innerHTML = '<span class="text-danger">Ingrese un DNI válido de 8 dígitos.</span>';
            if (buscarBtn) buscarBtn.disabled = false;
            if (spinnerBuscar) spinnerBuscar.classList.add('d-none');
            return;
        }
        if (!programa) {
            respuestaDiv.innerHTML = '<span class="text-danger">Seleccione un programa.</span>';
            if (buscarBtn) buscarBtn.disabled = false;
            if (spinnerBuscar) spinnerBuscar.classList.add('d-none');
            return;
        }

        // Buscar postulante
        fetch('./api/api_postulantes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=buscar&dni=${encodeURIComponent(dni)}&programa=${encodeURIComponent(programa)}`
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.encontrado) {
                respuestaDiv.innerHTML = `
                    <div>
                        <strong>DNI:</strong> ${data.dni}<br>
                        <strong>Nombre:</strong> ${data.nombres} ${data.apellidos}<br>
                        <strong>Correo:</strong> ${data.correo}<br>
                        <strong>Facultad:</strong> ${data.facultad}<br>
                        <strong>Programa:</strong> ${data.programa}<br>
                        <span class="text-success">¡Postulante encontrado!</span>
                        ${data.token ? `<span class="ms-3 badge bg-info text-dark">Token: <b>${data.token}</b></span>` : ''}
                    </div>
                `;
                // Mostrar sección de subida
                document.getElementById('subidaDocumentos').classList.remove('d-none');
                document.getElementById('subidaSection').classList.remove('d-none');
                // Rellenar los campos ocultos del formulario de subida
                document.getElementById('dniSubida').value = data.dni;
                document.getElementById('nombreSubida').value = data.nombres + ' ' + data.apellidos;
                document.getElementById('correoSubida').value = data.correo;
                document.getElementById('nombrePostulante').textContent = data.nombres;
                document.getElementById('apellidoPostulante').textContent = data.apellidos;
                document.getElementById('facultadSubida').value = data.facultad; // data.facultad viene de la búsqueda
                document.getElementById('programaSubida').value = data.programa; // data.programa viene de la búsqueda
            } else {
                respuestaDiv.innerHTML = `<span class="text-danger">${data.mensaje}</span>`;
                document.getElementById('subidaDocumentos').classList.add('d-none');
                document.getElementById('subidaSection').classList.add('d-none');
            }
        })
        .catch((err) => {
            respuestaDiv.innerHTML = '<span class="text-danger">Error en la consulta: ' + err + '</span>';
            subidaSection.classList.add('d-none');
        })
        .finally(() => {
            if (buscarBtn) buscarBtn.disabled = false;
            if (spinnerBuscar) spinnerBuscar.classList.add('d-none');
        });
    });

    // Simulación de subida de archivos
    const formSubida = document.getElementById('formSubida');
    if (formSubida) {
        formSubida.addEventListener('submit', function (e) {
            e.preventDefault();
            const mensaje = document.getElementById('mensajeSubida');
            mensaje.textContent = '';
            mensaje.className = '';

            // Deshabilitar el botón de subir archivos
            const submitBtn = formSubida.querySelector('button[type="submit"]');
            const spinner = document.getElementById('spinnerSubida');
            if (submitBtn) submitBtn.disabled = true;
            if (spinner) spinner.classList.remove('d-none');

            // Crear FormData y agregar campos manualmente para asegurar que todo se envíe correctamente
            const formData = new FormData();
            
            // Agregar campos del formulario
            formData.append('action', 'subir_archivos');
            formData.append('dni', document.getElementById('dniSubida').value);
            formData.append('nombre', document.getElementById('nombreSubida').value);
            formData.append('correo', document.getElementById('correoSubida').value);
            formData.append('facultad', document.getElementById('facultadSubida').value);
            formData.append('programa', document.getElementById('programaSubida').value);
            
            // Agregar archivos
            const pdfInput = document.getElementById('archivoPdf');
            const imgInput = document.getElementById('imagen');
            
            if (pdfInput && pdfInput.files.length > 0) {
                formData.append('archivoPdf', pdfInput.files[0]);
            } else {
                throw new Error('Por favor, selecciona un archivo PDF.');
            }
            
            if (imgInput && imgInput.files.length > 0) {
                formData.append('imagen', imgInput.files[0]);
            } else {
                throw new Error('Por favor, selecciona una imagen.');
            }

            fetch('./api/api_postulantes.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(data => {
                try {
                    const dataJson = JSON.parse(data);
                    console.log('JSON parseado correctamente:', dataJson);
                    if (dataJson.ok) {
                        mensaje.innerHTML = `
                            <div class="alert alert-success mt-3">
                                ${dataJson.mensaje}
                            </div>
                        `;
                        formSubida.reset();
                    } else {
                        mensaje.textContent = dataJson.mensaje || 'Error al subir archivos.';
                        mensaje.className = "alert alert-danger mt-3";
                    }
                } catch (error) {
                    mensaje.textContent = 'Error de red al subir archivos.';
                    mensaje.className = "alert alert-danger mt-3";
                }
            })
            .finally(() => {
                // Habilitar el botón y ocultar el spinner después de la respuesta
                if (submitBtn) submitBtn.disabled = false;
                if (spinner) spinner.classList.add('d-none');
            });
        });
    }

    // Consulta por token y muestra tabla de resultados
    const formToken = document.getElementById('formToken');
    if (formToken) {
        formToken.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Obtener elementos del DOM
            const token = document.getElementById('tokenInput').value.trim();
            const mensaje = document.getElementById('tokenMensaje');
            const tabla = document.getElementById('tablaToken');
            const tbody = document.getElementById('tablaTokenBody');
            const consultarBtn = document.querySelector('#formToken button[type="submit"]');
            const consultarText = document.getElementById('consultarText');
            const consultarSpinner = document.getElementById('consultarSpinner');
            
            // Limpiar mensajes y tabla
            mensaje.innerHTML = '';
            tabla.style.display = 'none';
            tbody.innerHTML = '';

            // Validar token
            if (!token) {
                mensaje.innerHTML = '<div class="alert alert-warning">Debe ingresar un token.</div>';
                return;
            }

            // Mostrar spinner y deshabilitar botón
            if (consultarBtn) consultarBtn.disabled = true;
            if (consultarText) consultarText.textContent = 'Consultando...';
            if (consultarSpinner) consultarSpinner.classList.remove('d-none');

            // Consultar token
            fetch('./api/api_postulantes.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=consultar_token&token=${encodeURIComponent(token)}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.encontrado) {
                    mensaje.innerHTML = `
                        <div class="mb-2">
                            <strong class="text-primary">Token de acceso:</strong>
                            <span class="fw-bold">${token}</span>
                        </div>
                    `;
                    const estadoClass = data.estado === 'Aprobado' ? 'bg-success' : 'bg-danger';
                    tbody.innerHTML = `
                        <tr>
                            <td data-title="DNI">${data.dni}</td>
                            <td data-title="Nombre">${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}</td>
                            <td data-title="Correo">${data.correo}</td>
                            <td data-title="Carpeta Drive">
                                ${data.carpeta_drive && data.carpeta_drive !== '#' ? 
                                    `<a href="${data.carpeta_drive}" target="_blank" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-folder-open me-1"></i> Ver carpeta
                                    </a>` : 
                                    '<span class="text-muted">No disponible</span>'}
                            </td>
                            <td data-title="Estado"><span class="badge ${estadoClass}">${data.estado || 'Pendiente'}</span></td>
                            <td data-title="Mensaje">${data.mensaje_estado || 'En proceso de revisión'}</td>
                        </tr>
                    `;
                    tabla.style.display = '';
                } else {
                    mensaje.innerHTML = `<div class="alert alert-danger">${data.mensaje || 'No se encontraron datos para este token.'}</div>`;
                    tabla.style.display = 'none';
                }
            })
            .catch((error) => {
                console.error('Error al consultar token:', error);
                mensaje.innerHTML = '<div class="alert alert-danger">Error al consultar el token. Por favor, intente nuevamente.</div>';
                tabla.style.display = 'none';
            })
            .finally(() => {
                // Restaurar botón
                if (consultarBtn) consultarBtn.disabled = false;
                if (consultarText) consultarText.textContent = 'Consultar';
                if (consultarSpinner) consultarSpinner.classList.add('d-none');
            });
        });
    }

    // Cargar programas_detalle_programa.json y poblar el select
    /*const jsonPath = './config/programas_detalle_programa.json';
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            facultadesData = data;
            facultadSelect.innerHTML = '<option value="">Seleccione una facultad</option>';
            Object.keys(facultadesData).forEach(facultad => {
                const option = document.createElement('option');
                option.value = facultad;
                option.textContent = facultad;
                facultadSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error al cargar el archivo JSON:', error);
            facultadSelect.innerHTML = '<option value="">Error al cargar facultades</option>';
        });*/
});