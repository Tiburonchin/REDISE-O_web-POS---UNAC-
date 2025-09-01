// modern-stepper.js
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    let currentStep = 0;

    const updateStepper = () => {
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        formSteps.forEach((formStep, index) => {
            formStep.classList.toggle('active', index === currentStep);
        });
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStepper();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepper();
            }
        });
    });

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Allow navigation to previous steps
            if (step.classList.contains('completed')) {
                currentStep = index;
                updateStepper();
            }
        });
    });

    // Initial setup
    updateStepper();
});