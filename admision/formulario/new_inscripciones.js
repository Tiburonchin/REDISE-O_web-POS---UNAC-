document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscription-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepperItems = Array.from(document.querySelectorAll('.step'));
    const progressLine = document.querySelector('.progress-line');
    let currentStep = 1;

    const updateTotalProgress = () => {
        const completedSteps = currentStep - 1;
        const totalSteps = steps.length -1;
        const progress = (completedSteps / totalSteps) * 100;
        progressLine.style.width = `${progress}%`;
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

    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        currentStep = stepNumber;
        updateStepper();
    };

    form.addEventListener('click', (e) => {
        if (e.target.matches('.next-step')) {
            // Basic validation before proceeding
            const currentStepFields = steps[currentStep - 1].querySelectorAll('[required]');
            let isValid = true;
            currentStepFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    // Add some visual feedback for invalid fields
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

    // Load Unidades and Programas from JSON
    const unidadSelect = document.getElementById('unidad');
    const programaSelect = document.getElementById('programa');
    const detalleProgramaContainer = document.getElementById('detalle_programa_container');
    const detalleProgramaInput = document.getElementById('detalle_programa');
    const selectedDetalleText = document.getElementById('selected-detalle-text');

    fetch('programas.json')
        .then(response => response.json())
        .then(data => {
            data.unidades.forEach(unidad => {
                const option = new Option(unidad.nombre, unidad.nombre);
                unidadSelect.add(option);
            });

            unidadSelect.addEventListener('change', () => {
                const selectedUnidad = data.unidades.find(u => u.nombre === unidadSelect.value);
                programaSelect.innerHTML = '<option value="" disabled selected hidden>Seleccione un programa</option>';
                detalleProgramaContainer.innerHTML = '';
                selectedDetalleText.textContent = '';
                detalleProgramaInput.value = '';

                if (selectedUnidad) {
                    selectedUnidad.programas.forEach(programa => {
                        const option = new Option(programa.nombre, programa.nombre);
                        programaSelect.add(option);
                    });
                }
            });

            programaSelect.addEventListener('change', () => {
                const selectedUnidad = data.unidades.find(u => u.nombre === unidadSelect.value);
                const selectedPrograma = selectedUnidad.programas.find(p => p.nombre === programaSelect.value);
                detalleProgramaContainer.innerHTML = '';
                selectedDetalleText.textContent = '';
                detalleProgramaInput.value = '';

                if (selectedPrograma && selectedPrograma.detalles) {
                    selectedPrograma.detalles.forEach(detalle => {
                        const radioWrapper = document.createElement('div');
                        radioWrapper.classList.add('form-check');

                        const radio = document.createElement('input');
                        radio.classList.add('form-check-input');
                        radio.type = 'radio';
                        radio.name = 'detalle_programa_radio';
                        radio.id = detalle.replace(/\s+/g, '-');
                        radio.value = detalle;

                        const label = document.createElement('label');
                        label.classList.add('form-check-label');
                        label.htmlFor = radio.id;
                        label.textContent = detalle;

                        radioWrapper.appendChild(radio);
                        radioWrapper.appendChild(label);
                        detalleProgramaContainer.appendChild(radioWrapper);

                        radio.addEventListener('change', () => {
                            detalleProgramaInput.value = detalle;
                            selectedDetalleText.textContent = detalle;
                        });
                    });
                }
            });
        });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Final validation
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;
        requiredFields.forEach(field => {
            if (!field.value && field.type !== 'hidden') {
                isFormValid = false;
                field.classList.add('is-invalid');
            }
        });

        if (!document.getElementById('privacy-policy').checked) {
            isFormValid = false;
            document.getElementById('privacy-policy').classList.add('is-invalid');
        }

        if (isFormValid) {
            const formData = new FormData(form);
            fetch('proceso_form_preinscripcion.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === 'OK_REDIRECT') {
                    window.location.href = 'gracias.html'; // Create a thank you page
                } else {
                    // Handle errors
                    alert(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar el formulario.');
            });
        }
    });

    // Initial setup
    showStep(1);
});
