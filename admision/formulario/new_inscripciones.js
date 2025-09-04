document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscription-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepperItems = Array.from(document.querySelectorAll('.step'));
    const progressLine = document.querySelector('.progress-line');
    let currentStep = 1;

    const updateTotalProgress = () => {
        const completedSteps = currentStep - 1;
        const totalSteps = stepperItems.length - 1;
        if (totalSteps > 0) {
            const trackWidthPercent = 100 - (100 / stepperItems.length);
            const progressPercent = (completedSteps / totalSteps);
            const finalWidth = progressPercent * trackWidthPercent;
            progressLine.style.width = `${finalWidth}%`;
        } else {
            progressLine.style.width = '0%';
        }
    };

    const updateStepper = () => {
        stepperItems.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        updateTotalProgress();
    };

    const generateSummary = () => {
        const summaryContainer = document.getElementById('summary');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const unidad = data.unidad;
        const programa = data.programa;
        const detallePrograma = data.detalle_programa;
        const medioConocimiento = document.querySelector('input[name="medio_conocimiento"]:checked') ? document.querySelector('input[name="medio_conocimiento"]:checked').value : 'No especificado';
        const domicilio = document.querySelector('input[name="domicilio"]:checked') ? document.querySelector('input[name="domicilio"]:checked').labels[0].textContent : 'No especificado';

        summaryContainer.innerHTML = `
            <div class="summary-section">
                <h4 class="summary-title">Datos Personales</h4>
                <div class="summary-grid">
                    <div class="summary-item"><span class="summary-label">Nombres</span><span class="summary-value">${data.nombre}</span></div>
                    <div class="summary-item"><span class="summary-label">Apellidos</span><span class="summary-value">${data.apellidos}</span></div>
                    <div class="summary-item"><span class="summary-label">Correo Electrónico</span><span class="summary-value">${data.correo}</span></div>
                    <div class="summary-item"><span class="summary-label">DNI</span><span class="summary-value">${data.dni}</span></div>
                    <div class="summary-item"><span class="summary-label">Celular</span><span class="summary-value">${data.telefono}</span></div>
                    <div class="summary-item"><span class="summary-label">Fecha de Nacimiento</span><span class="summary-value">${data.fecha_nacimiento}</span></div>
                    <div class="summary-item"><span class="summary-label">Lugar donde vives</span><span class="summary-value">${domicilio}</span></div>
                </div>
            </div>
            <div class="summary-section">
                <h4 class="summary-title">Programa de Interés</h4>
                <div class="summary-grid">
                    <div class="summary-item"><span class="summary-label">Unidad</span><span class="summary-value">${unidad}</span></div>
                    <div class="summary-item"><span class="summary-label">Tipo de Programa</span><span class="summary-value">${programa}</span></div>
                    <div class="summary-item summary-item-full"><span class="summary-label">Programa</span><span class="summary-value">${detallePrograma}</span></div>
                </div>
            </div>
             <div class="summary-section">
                <h4 class="summary-title">Información Adicional</h4>
                 <div class="summary-grid">
                    <div class="summary-item summary-item-full"><span class="summary-label">¿Cómo se enteró de nosotros?</span><span class="summary-value">${medioConocimiento}</span></div>
                </div>
            </div>
        `;
    };

    const showStep = (stepNumber) => {
        if (stepNumber === 3) {
            generateSummary();
        }
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        currentStep = stepNumber;
        updateStepper();
    };

    form.addEventListener('click', (e) => {
        if (e.target.matches('.next-step')) {
            const currentStepFields = steps[currentStep - 1].querySelectorAll('[required]');
            let isValid = true;
            currentStepFields.forEach(field => {
                if (field.type === 'radio') {
                    const radioGroup = document.getElementsByName(field.name);
                    if (!Array.from(radioGroup).some(r => r.checked)) {
                        isValid = false;
                        const container = field.closest('.radio-group-container') || field.closest('.detalle-programa-container');
                        if(container) container.classList.add('is-invalid');
                    }
                } else if (!field.value) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            });

            if (isValid) {
                showStep(currentStep + 1);
            }
        }

        if (e.target.matches('.prev-step')) {
            showStep(currentStep - 1);
        }
    });

    const unidadContainer = document.getElementById('unidad-container');
    const programaContainer = document.getElementById('programa-container');
    const detalleProgramaContainer = document.getElementById('detalle_programa_container');
    const unidadInput = document.getElementById('unidad');
    const programaInput = document.getElementById('programa');
    const detalleProgramaInput = document.getElementById('detalle_programa');
    const selectedDetalleText = document.getElementById('selected-detalle-text');
    const unidadSearch = document.getElementById('unidad-search');

    const createRadioCard = (name, value, labelText, container, onChangeCallback) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('form-check');
        const input = document.createElement('input');
        input.classList.add('form-check-input');
        input.type = 'radio';
        input.name = name;
        const inputId = `${name}-${value.replace(/[^a-zA-Z0-9]/g, '-')}`;
        input.id = inputId;
        input.value = value;
        input.required = true;
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.htmlFor = inputId;
        label.textContent = labelText;
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
        input.addEventListener('change', onChangeCallback);
        return input;
    };

    fetch('programas.json')
        .then(response => response.json())
        .then(data => {
            unidadContainer.innerHTML = '';
            const facultades = Object.keys(data);

            facultades.forEach(facultad => {
                const item = document.createElement('div');
                item.classList.add('list-item');
                item.textContent = facultad;
                item.dataset.value = facultad;
                unidadContainer.appendChild(item);

                item.addEventListener('click', () => {
                    unidadInput.value = facultad;

                    document.querySelectorAll('#unidad-container .list-item').forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');

                    programaContainer.innerHTML = '';
                    detalleProgramaContainer.innerHTML = '';
                    programaInput.value = '';
                    detalleProgramaInput.value = '';
                    selectedDetalleText.textContent = '';
                    document.getElementById('selected-detalle-display').style.display = 'none';

                    const selectedFacultad = data[facultad];
                    if (selectedFacultad) {
                        const tiposDePrograma = Object.keys(selectedFacultad).filter(key => !key.includes('pdf_link'));
                        tiposDePrograma.forEach(tipo => {
                            createRadioCard('programa_radio', tipo, tipo, programaContainer, () => {
                                programaInput.value = tipo;
                                detalleProgramaContainer.innerHTML = '';
                                detalleProgramaInput.value = '';
                                selectedDetalleText.textContent = '';
                                document.getElementById('selected-detalle-display').style.display = 'none';

                                const programas = selectedFacultad[tipo];
                                if (programas && Array.isArray(programas)) {
                                    programas.forEach(programa => {
                                        createRadioCard('detalle_programa_radio', programa, programa, detalleProgramaContainer, () => {
                                            detalleProgramaInput.value = programa;
                                            selectedDetalleText.textContent = programa;
                                            document.getElementById('selected-detalle-display').style.display = 'block';
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });

            unidadSearch.addEventListener('input', () => {
                const searchTerm = unidadSearch.value.toLowerCase();
                document.querySelectorAll('#unidad-container .list-item').forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar o procesar los programas:', error);
            unidadContainer.innerHTML = '<p class="text-danger">Error al cargar las unidades.</p>';
        });

    const showSuccessMessage = () => {
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-message-box">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h2>¡Inscripción Enviada!</h2>
                <p>Gracias por registrarte. Hemos recibido tus datos correctamente.</p>
                <p>Nos pondremos en contacto contigo pronto.</p>
                <button id="close-success-message" class="btn btn-primary">Cerrar</button>
            </div>
        `;
        document.body.appendChild(successOverlay);

        document.getElementById('close-success-message').addEventListener('click', () => {
            document.body.removeChild(successOverlay);
            form.reset();
            // Redirigir a Proceso_admision.html y activar el paso 2 del stepper
            window.location.href = '../Proceso_admision.html#ir-paso-2';
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');

        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;
        requiredFields.forEach(field => {
            if (field.type === 'radio' || field.type === 'checkbox') {
                 const fieldGroup = document.getElementsByName(field.name);
                 if (!Array.from(fieldGroup).some(f => f.checked)) {
                     isFormValid = false;
                     field.classList.add('is-invalid');
                 }
            }
            else if (!field.value && field.type !== 'hidden') {
                isFormValid = false;
                field.classList.add('is-invalid');
            }
        });

        if (!isFormValid) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

        const formData = new FormData(form);
        fetch('proceso_form_preinscripcion.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.trim().toUpperCase().includes('OK')) { // More flexible check
                showSuccessMessage();
            } else {
                alert('Hubo un error al enviar su inscripción: ' + data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error de red al enviar el formulario.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Inscripción';
        });
    });

    // Initial setup
    showStep(1);
});
