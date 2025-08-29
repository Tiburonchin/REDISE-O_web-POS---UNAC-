document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inscription-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepperItems = Array.from(document.querySelectorAll('.stepper-item'));
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.getElementById('progress-bar');

    let currentStep = 0;

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    function updateProgress() {
        const progressPercentage = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        stepperItems.forEach((item, index) => {
            if (index < currentStep) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index === currentStep) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
    }

    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;

        steps[currentStep].classList.remove('active');
        currentStep = stepIndex;
        steps[currentStep].classList.add('active');
        
        updateProgress();

        if (currentStep === steps.length - 1) { // Summary step
            generateSummary();
        }
    }

    function validateStep(stepIndex) {
        let isValid = true;
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateInput(input) {
        const value = input.value.trim();
        const feedbackContainer = input.parentElement.querySelector('.invalid-feedback');
        let message = '';

        // For radio buttons, check if one is selected
        if (input.type === 'radio' && input.required) {
            const radioGroup = document.getElementsByName(input.name);
            if (!Array.from(radioGroup).some(radio => radio.checked)) {
                 message = 'Debe seleccionar una opción.';
                 // Find the container to show feedback
                 const radioContainer = input.closest('div');
                 const radioFeedback = radioContainer.parentElement.querySelector('.invalid-feedback');
                 if(radioFeedback) {
                    radioFeedback.textContent = message;
                    radioFeedback.style.display = 'block';
                 }
                 return false;
            } else {
                 const radioContainer = input.closest('div');
                 const radioFeedback = radioContainer.parentElement.querySelector('.invalid-feedback');
                 if(radioFeedback) {
                    radioFeedback.textContent = '';
                    radioFeedback.style.display = 'none';
                 }
            }
        }


        if (input.required && value === '' && input.type !== 'radio') {
            message = 'Este campo es obligatorio.';
        } else if (input.type === 'email' && value !== '' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            message = 'El correo no es válido.';
        } else if (input.id === 'dni' && value !== '' && !/^\d{8}$/.test(value)) {
            message = 'El DNI debe tener 8 dígitos.';
        } else if (input.id === 'celular' && value !== '' && !/^\d{9}$/.test(value)) {
            message = 'El celular debe tener 9 dígitos.';
        }

        if (message && feedbackContainer) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedbackContainer.textContent = message;
            feedbackContainer.style.display = 'block';
            return false;
        } else if (feedbackContainer) {
            input.classList.remove('is-invalid');
            if(input.required) {
               input.classList.add('is-valid');
            }
            feedbackContainer.textContent = '';
            feedbackContainer.style.display = 'none';
            return true;
        }
        return true;
    }

    steps.forEach(step => {
        const inputs = step.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateInput(input));
        });
    });

    // Load program data
    const unidadSelect = document.getElementById('unidad');
    const programaSelect = document.getElementById('programa');
    const detalleProgramaSelect = document.getElementById('detalle_programa');

    fetch('programas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const unidades = Object.keys(data);
            unidades.forEach(unidad => {
                const option = document.createElement('option');
                option.value = unidad;
                option.textContent = unidad;
                unidadSelect.appendChild(option);
            });

            unidadSelect.addEventListener('change', () => {
                const selectedUnidad = unidadSelect.value;
                programaSelect.innerHTML = '<option value="">Seleccione un programa</option>';
                detalleProgramaSelect.innerHTML = '';
                validateInput(unidadSelect); // Validate on change

                if (selectedUnidad) {
                    const programas = Object.keys(data[selectedUnidad]);
                    programas.forEach(programa => {
                        const option = document.createElement('option');
                        option.value = programa;
                        option.textContent = programa;
                        programaSelect.appendChild(option);
                    });
                }
            });

            programaSelect.addEventListener('change', () => {
                const selectedUnidad = unidadSelect.value;
                const selectedPrograma = programaSelect.value;
                detalleProgramaSelect.innerHTML = '';
                validateInput(programaSelect); // Validate on change

                if (selectedUnidad && selectedPrograma) {
                    const detalles = data[selectedUnidad][selectedPrograma];
                    detalles.forEach(detalle => {
                        const option = document.createElement('option');
                        option.value = detalle;
                        option.textContent = detalle;
                        detalleProgramaSelect.appendChild(option);
                    });
                }
            });
             detalleProgramaSelect.addEventListener('change', () => validateInput(detalleProgramaSelect));
        })
        .catch(error => {
            console.error('Error fetching program data:', error);
            // Optionally, display an error to the user in the UI
        });

    function generateSummary() {
        const summaryContainer = document.getElementById('summary');
        const formData = new FormData(form);
        let summaryHTML = '<ul>';

        // Manually get labels for better formatting
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

        for (let [key, value] of formData.entries()) {
            const label = fieldLabels[key] || key;
            if(value && typeof value === 'string' && value.trim() !== '') {
                summaryHTML += `<li><strong>${label}:</strong> ${value.trim()}</li>`;
            }
        }

        summaryHTML += '</ul>';
        summaryContainer.innerHTML = `<h4>Resumen de Inscripción</h4><p>Por favor, revise sus datos antes de enviar.</p>${summaryHTML}`;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const privacyPolicy = document.getElementById('privacy-policy');
        if (!privacyPolicy.checked) {
            const feedback = privacyPolicy.parentElement.querySelector('.invalid-feedback');
            feedback.style.display = 'block';
            privacyPolicy.classList.add('is-invalid');
            return;
        }

        if (validateStep(currentStep)) {
            // Handle form submission, e.g., send data to server
            // In a real scenario, you would use fetch() to POST the data
            console.log('Form submitted successfully');
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            setTimeout(() => { // Simulate network request
                alert('Inscripción enviada con éxito!');
                form.reset();
                goToStep(0);
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Inscripción';
                submitButton.disabled = false;
                // Reset validation states
                form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
            }, 1500);
        }
    });

    // Initial setup
    updateProgress();
});