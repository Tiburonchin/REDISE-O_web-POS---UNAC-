document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Selection ---
    const form = document.getElementById('inscription-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepperItems = Array.from(document.querySelectorAll('.stepper-item'));
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.getElementById('progress-bar');
    const dniInput = document.getElementById('dni');

    let currentStep = 0;

    // --- Event Listeners ---

    // DNI input to accept only numbers
    if (dniInput) {
        dniInput.addEventListener('input', () => {
            dniInput.value = dniInput.value.replace(/[^0-9]/g, '');
        });
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Validate all fields in the current step before proceeding
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            } else {
                // If validation fails, focus on the first invalid field
                const firstInvalid = steps[currentStep].querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Final validation before submitting
        if (validateStep(currentStep) && isPrivacyPolicyAccepted()) {
            submitForm();
        }
    });

    // Add real-time validation listeners to all required inputs
    steps.forEach(step => {
        const inputs = step.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            // 'input' event for text fields, 'change' for selects and radios
            const eventType = input.tagName.toLowerCase() === 'select' || input.type === 'radio' ? 'change' : 'input';
            input.addEventListener(eventType, () => validateInput(input));
        });
    });

    // --- Stepper and Progress Bar Logic ---

    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;

        steps[currentStep].classList.remove('active');
        currentStep = stepIndex;
        steps[currentStep].classList.add('active');
        
        updateProgress();

        // Generate summary content when reaching the final step
        if (currentStep === steps.length - 1) {
            generateSummary();
        }
    }

    function updateProgress() {
        const progressPercentage = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        stepperItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index < currentStep) {
                // Mark previous steps as completed
                item.classList.add('completed');
            } else if (index === currentStep) {
                item.classList.add('active');
            }
        });
    }

    // --- Validation Logic ---

    function validateStep(stepIndex) {
        let isStepValid = true;
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input[required], select[required]');

        // Iterate over all inputs in the step and validate them
        inputs.forEach(input => {
            // `isStepValid` becomes false if any input is invalid
            if (!validateInput(input)) {
                isStepValid = false;
            }
        });

        // Special check for the final step's privacy policy
        if (stepIndex === steps.length - 1) {
            if (!isPrivacyPolicyAccepted()) {
                isStepValid = false;
            }
        }

        return isStepValid;
    }

    function validateInput(input) {
        const feedbackContainer = input.closest('.mb-3, .form-check').querySelector('.invalid-feedback');
        let message = '';

        if (input.type === 'radio') {
            const radioGroup = document.getElementsByName(input.name);
            if (!Array.from(radioGroup).some(radio => radio.checked)) {
                message = 'Debe seleccionar una opción.';
            }
        } else {
            const value = input.value.trim();
            if (input.required && value === '') {
                message = 'Este campo es obligatorio.';
            } else if (input.type === 'email' && value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = 'El correo no es válido.';
            } else if (input.id === 'dni' && value !== '' && !/^\d{8}$/.test(value)) {
                message = 'El DNI debe tener 8 dígitos.';
            } else if (input.id === 'celular' && value !== '' && !/^\d{9}$/.test(value)) {
                message = 'El celular debe tener 9 dígitos.';
            }
        }

        if (message) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            if (feedbackContainer) {
                feedbackContainer.textContent = message;
                feedbackContainer.style.display = 'block';
            }
            return false; // Invalid
        } else {
            input.classList.remove('is-invalid');
            if (input.required) {
                input.classList.add('is-valid');
            }
            if (feedbackContainer) {
                feedbackContainer.textContent = '';
                feedbackContainer.style.display = 'none';
            }
            return true; // Valid
        }
    }

    function isPrivacyPolicyAccepted() {
        const privacyPolicy = document.getElementById('privacy-policy');
        const feedback = privacyPolicy.parentElement.querySelector('.invalid-feedback');
        if (!privacyPolicy.checked) {
            privacyPolicy.classList.add('is-invalid');
            feedback.style.display = 'block';
            return false;
        }
        privacyPolicy.classList.remove('is-invalid');
        feedback.style.display = 'none';
        return true;
    }

    // --- Data Loading and Dynamic Content ---

    function loadProgramData() {
        const unidadSelect = document.getElementById('unidad');
        const programaSelect = document.getElementById('programa');
        const detalleProgramaContainer = document.getElementById('detalle_programa_container');
        const detalleProgramaInput = document.getElementById('detalle_programa');
        const selectedDetalleDisplay = document.getElementById('selected-detalle-display');
        const selectedDetalleText = document.getElementById('selected-detalle-text');

        fetch('programas.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Populate "Unidad" select
                Object.keys(data).forEach(unidad => {
                    unidadSelect.add(new Option(unidad, unidad));
                });

                // Handle "Unidad" change
                unidadSelect.addEventListener('change', () => {
                    programaSelect.innerHTML = '<option value="">Seleccione un programa</option>';
                    detalleProgramaContainer.innerHTML = '';
                    resetDetalleSelection();
                    validateInput(unidadSelect);

                    if (unidadSelect.value) {
                        Object.keys(data[unidadSelect.value])
                            .filter(programa => !['pdf_link', 'pdf_link_doctorado', 'pdf_link_especialidad'].includes(programa))
                            .forEach(programa => {
                                programaSelect.add(new Option(programa, programa));
                            });
                    }
                });

                // Handle "Programa" change
                programaSelect.addEventListener('change', () => {
                    detalleProgramaContainer.innerHTML = '';
                    resetDetalleSelection();
                    validateInput(programaSelect);

                    if (unidadSelect.value && programaSelect.value) {
                        const detalles = data[unidadSelect.value][programaSelect.value];
                        detalles.forEach((detalle, index) => {
                            const card = createDetalleCard(detalle, index);
                            detalleProgramaContainer.appendChild(card);
                        });
                    }
                });

                // Handle "Detalle" selection
                detalleProgramaContainer.addEventListener('click', (e) => {
                    const card = e.target.closest('.detalle-option-card');
                    if (!card) return;

                    const radio = card.querySelector('input[type="radio"]');
                    if (!radio) return;

                    // Update UI
                    detalleProgramaContainer.querySelectorAll('.detalle-option-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    radio.checked = true;

                    // Update hidden input and display
                    detalleProgramaInput.value = radio.value;
                    selectedDetalleText.textContent = radio.value;
                    selectedDetalleDisplay.style.display = 'block';
                    validateInput(detalleProgramaInput);
                });
            })
            .catch(error => {
                console.error('Error fetching program data:', error);
                // Optionally, display an error to the user
            });

        function resetDetalleSelection() {
            detalleProgramaInput.value = '';
            selectedDetalleDisplay.style.display = 'none';
            selectedDetalleText.textContent = '';
        }

        function createDetalleCard(detalle, index) {
            const card = document.createElement('div');
            card.className = 'detalle-option-card';
            card.dataset.value = detalle;
            const radioId = `detalle-${index}`;
            card.innerHTML = `
                <input type="radio" id="${radioId}" name="detalle_programa_radio" value="${detalle}" class="form-check-input">
                <i class="fas fa-book-open icon"></i>
                <label for="${radioId}" class="form-check-label ms-2">${detalle}</label>
            `;
            return card;
        }
    }

    // --- Summary and Submission ---

    function generateSummary() {
        const summaryContainer = document.getElementById('summary');
        const formData = new FormData(form);
        const fieldLabels = {
            nombres: 'Nombres',
            apellidos: 'Apellidos',
            email: 'Correo Electrónico',
            dni: 'DNI',
            celular: 'Celular',
            fecha_nacimiento: 'Fecha de Nacimiento',
            lugar_residencia: 'Lugar de Residencia',
            unidad: 'Unidad',
            programa: 'Programa',
            detalle_programa: 'Detalle del Programa',
            medio_conocimiento: '¿Cómo se enteró?'
        };

        let summaryHTML = '<ul>';
        for (let [key, value] of formData.entries()) {
            const label = fieldLabels[key] || key;
            if (value && typeof value === 'string' && value.trim() !== '' && key !== 'detalle_programa_radio') {
                summaryHTML += `<li><strong>${label}:</strong> <span>${value.trim()}</span></li>`;
            }
        }
        summaryHTML += '</ul>';
        summaryContainer.innerHTML = `<h4>Resumen de Inscripción</h4><p>Por favor, revise sus datos antes de enviar.</p>${summaryHTML}`;
    }

    function submitForm() {
        console.log('Form submitted successfully');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        // Simulate network request
        setTimeout(() => {
            alert('Inscripción enviada con éxito!');
            form.reset();
            goToStep(0);
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Inscripción';
            submitButton.disabled = false;
            form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            // Also reset the detail program selection UI
            document.getElementById('detalle_programa_container').querySelectorAll('.detalle-option-card').forEach(c => c.classList.remove('selected'));
            document.getElementById('selected-detalle-display').style.display = 'none';

        }, 1500);
    }

    // --- Initial Setup ---
    updateProgress();
    loadProgramData();
});