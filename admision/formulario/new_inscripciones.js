document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('inscription-form');
    const formWrapper = document.getElementById('form-wrapper');
    const successMessage = document.getElementById('success-message');
    
    const stepperItems = document.querySelectorAll('.stepper-item');
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.stepper-progress');

    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    const unidadSelect = document.getElementById('unidad');
    const programaSelect = document.getElementById('programa');
    const detalleSelect = document.getElementById('detalle_programa');
    const medioConocimientoSelect = document.getElementById('medio_conocimiento');

    // --- ESTADO --- 
    let currentStep = 0;
    let programsData = null;

    // --- CLASE PARA CUSTOM SELECT ---
    class CustomSelect {
        constructor(selectElement) {
            this.selectElement = selectElement;
            this.customSelect = null;
            this.selectTrigger = null;
            this.customOptions = null;

            this._setup();
        }

        _setup() {
            this.selectElement.classList.add('original-select');

            const wrapper = document.createElement('div');
            wrapper.classList.add('custom-select-wrapper');
            this.selectElement.parentNode.insertBefore(wrapper, this.selectElement);
            wrapper.appendChild(this.selectElement);

            this.customSelect = document.createElement('div');
            this.customSelect.classList.add('custom-select');
            wrapper.appendChild(this.customSelect);

            this.selectTrigger = document.createElement('div');
            this.selectTrigger.classList.add('select-trigger');
            this.customSelect.appendChild(this.selectTrigger);

            this.customOptions = document.createElement('div');
            this.customOptions.classList.add('custom-options');
            this.customSelect.appendChild(this.customOptions);

            this.selectTrigger.addEventListener('click', () => {
                this.customSelect.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!this.customSelect.contains(e.target)) {
                    this.customSelect.classList.remove('open');
                }
            });

            this.selectElement.addEventListener('options-updated', () => this.update());
            this.update();
        }

        update() {
            const selectedOption = this.selectElement.options[this.selectElement.selectedIndex];
            this.selectTrigger.textContent = selectedOption ? selectedOption.textContent : '';
            this.customOptions.innerHTML = '';

            Array.from(this.selectElement.options).forEach(option => {
                const customOption = document.createElement('div');
                customOption.classList.add('custom-option');
                customOption.textContent = option.textContent;
                customOption.dataset.value = option.value;

                if (option.disabled) {
                    customOption.classList.add('disabled');
                }
                if (option.selected) {
                    customOption.classList.add('selected');
                }

                customOption.addEventListener('click', () => {
                    if (option.disabled) return;
                    this.selectElement.value = option.value;
                    const event = new Event('change', { bubbles: true });
                    this.selectElement.dispatchEvent(event);
                    this.customSelect.classList.remove('open');
                });
                this.customOptions.appendChild(customOption);
            });
        }
    }

    // --- INICIALIZACIÓN ---
    const init = () => {
        setupStepTransitions();
        setupFormSubmission();

        new CustomSelect(unidadSelect);
        new CustomSelect(programaSelect);
        new CustomSelect(detalleSelect);
        new CustomSelect(medioConocimientoSelect);

        fetchPrograms();
        updateUI();
    };

    // --- LÓGICA DE TRANSICIÓN DE PASOS ---
    const setupStepTransitions = () => {
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    if (currentStep === 1) { // Antes de pasar al resumen
                        generateSummary();
                    }
                    currentStep++;
                    updateUI();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentStep--;
                updateUI();
            });
        });

        stepperItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (item.classList.contains('completed')) {
                    currentStep = index;
                    updateUI();
                }
            });
        });
    };

    // --- ACTUALIZACIÓN DE LA INTERFAZ ---
    const updateUI = () => {
        stepperItems.forEach((item, index) => {
            item.classList.toggle('active', index < currentStep ? 'completed' : index === currentStep ? 'active' : '');
        });
        const progress = (currentStep / (stepperItems.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
    };

    // --- VALIDACIÓN ---
    const validateStep = (stepIndex) => {
        let isValid = true;
        const currentFormStep = formSteps[stepIndex];
        currentFormStep.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        currentFormStep.querySelectorAll('input[required], select[required]').forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });
        if (stepIndex === formSteps.length - 1) {
            const recaptchaResponse = grecaptcha.getResponse();
            const recaptchaErrorDiv = document.getElementById('recaptcha-error');
            if (recaptchaResponse.length === 0) {
                recaptchaErrorDiv.style.display = 'block';
                isValid = false;
            } else {
                recaptchaErrorDiv.style.display = 'none';
            }
        }
        return isValid;
    };

    // --- CARGA DE DATOS (PROGRAMAS) ---
    const fetchPrograms = async () => {
        try {
            const response = await fetch('programas.json');
            if (!response.ok) throw new Error('Network response was not ok');
            programsData = await response.json();
            populateUnidades();
        } catch (error) {
            console.error('Error al cargar los programas:', error);
            unidadSelect.innerHTML = '<option value="">No se pudieron cargar las unidades</option>';
            unidadSelect.dispatchEvent(new Event('options-updated'));
        }
    };

    const populateUnidades = () => {
        if (!programsData) return;
        unidadSelect.innerHTML = '<option value="" disabled selected>Seleccione una unidad</option>';
        Object.keys(programsData).forEach(unidadNombre => {
            const option = new Option(unidadNombre, unidadNombre);
            unidadSelect.add(option);
        });
        unidadSelect.dispatchEvent(new Event('options-updated'));
        unidadSelect.addEventListener('change', populateProgramas);
    };

    const populateProgramas = () => {
        const selectedUnidadNombre = unidadSelect.value;
        const unidad = programsData[selectedUnidadNombre];
        
        programaSelect.innerHTML = '<option value="" disabled selected>Seleccione un programa</option>';
        detalleSelect.innerHTML = '<option value="" disabled selected>Seleccione una unidad primero</option>';
        programaSelect.disabled = true;
        detalleSelect.disabled = true;

        if (unidad) {
            ['Maestría', 'Doctorado', 'Especialidad'].forEach(tipo => {
                if (unidad[tipo] && unidad[tipo].length > 0) {
                    const option = new Option(tipo, tipo);
                    programaSelect.add(option);
                }
            });
            programaSelect.disabled = false;
            programaSelect.addEventListener('change', populateDetalles);
        }
        programaSelect.dispatchEvent(new Event('options-updated'));
        detalleSelect.dispatchEvent(new Event('options-updated'));
    };

    const populateDetalles = () => {
        const selectedUnidadNombre = unidadSelect.value;
        const selectedProgramaTipo = programaSelect.value;
        const unidad = programsData[selectedUnidadNombre];
        
        detalleSelect.innerHTML = '<option value="" disabled selected>Seleccione una mención/doctorado</option>';
        detalleSelect.disabled = true;

        if (unidad && unidad[selectedProgramaTipo]) {
            unidad[selectedProgramaTipo].forEach(detalle => {
                const option = new Option(detalle, detalle);
                detalleSelect.add(option);
            });
            detalleSelect.disabled = false;
        }
        detalleSelect.dispatchEvent(new Event('options-updated'));
    };

    // --- GENERACIÓN DE RESUMEN ---
    const generateSummary = () => {
        const summaryContainer = document.getElementById('summary');
        const formData = new FormData(form);
        let summaryHTML = '<h5>Resumen de Datos</h5><ul class="list-unstyled">';

        const getElementText = (id) => {
            const element = document.getElementById(id);
            if (!element) return 'N/A';
            if (element.tagName === 'SELECT') {
                return element.options[element.selectedIndex]?.text || 'No seleccionado';
            }
            return element.value;
        };

        summaryHTML += `<li><strong>Nombres:</strong> ${formData.get('nombre')}</li>`;
        summaryHTML += `<li><strong>Apellidos:</strong> ${formData.get('apellidos')}</li>`;
        summaryHTML += `<li><strong>Correo:</strong> ${formData.get('correo')}</li>`;
        summaryHTML += `<li><strong>DNI:</strong> ${formData.get('dni')}</li>`;
        summaryHTML += `<li><strong>Celular:</strong> ${formData.get('telefono')}</li>`;
        summaryHTML += `<li><strong>Unidad:</strong> ${getElementText('unidad')}</li>`;
        summaryHTML += `<li><strong>Programa:</strong> ${getElementText('programa')}</li>`;
        summaryHTML += `<li><strong>Mención/Doctorado:</strong> ${getElementText('detalle_programa')}</li>`;
        summaryHTML += '</ul>';
        summaryContainer.innerHTML = summaryHTML;
    };

    // --- ENVÍO DE FORMULARIO ---
    const setupFormSubmission = () => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateStep(currentStep)) {
                alert('Por favor, corrija los errores antes de continuar.');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const resultText = await response.text();

                if (resultText.includes('OK_REDIRECT')) {
                    formWrapper.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    throw new Error(resultText || 'Ocurrió un error desconocido.');
                }
            } catch (error) {
                alert(`Error al enviar el formulario: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Enviar Inscripción';
            }
        });
    };

    // --- INICIAR LA APLICACIÓN ---
    init();
});