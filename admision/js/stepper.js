document.addEventListener('DOMContentLoaded', () => {
        const stepperItems = document.querySelectorAll('.stepper-item');
        const stepPanes = document.querySelectorAll('.step-pane');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const geminiBtn = document.getElementById('geminiBtn');
        const geminiResult = document.getElementById('geminiResult');
        const loader = document.getElementById('loader');
        const geminiBtnText = document.getElementById('geminiBtnText');

        let currentStep = 1;
        const totalSteps = stepperItems.length;

        const updateStepper = () => {
            stepperItems.forEach((item, index) => {
                const step = index + 1;
                if (step < currentStep) {
                    item.classList.add('completed');
                    item.classList.remove('active');
                } else if (step === currentStep) {
                    item.classList.add('active');
                    item.classList.remove('completed');
                } else {
                    item.classList.remove('active', 'completed');
                }
            });

            stepPanes.forEach(pane => {
                pane.classList.toggle('active', parseInt(pane.dataset.step) === currentStep);
            });
            
            prevBtn.disabled = currentStep === 1;
            nextBtn.disabled = currentStep === totalSteps;
        };
        
        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepper();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepper();
            }
        });

        stepperItems.forEach(item => {
            item.addEventListener('click', () => {
                const clickedStep = parseInt(item.dataset.step);
                if (item.classList.contains('completed') || clickedStep === currentStep || clickedStep === currentStep + 1) {
                     currentStep = clickedStep;
                     updateStepper();
                }
            });
        });
        
        // --- Gemini API Feature ---
        geminiBtn.addEventListener('click', async () => {
            geminiBtn.disabled = true;
            geminiResult.style.display = 'none';
            loader.style.display = 'block';
            geminiBtnText.textContent = 'Generando...';

            const prompt = "Eres un coach de entrevistas. Dame 3 consejos breves (máximo 15 palabras por consejo) y 3 preguntas comunes de entrevista (solo la pregunta). Usa este formato exacto:\n**Consejos:**\n- Consejo 1\n- Consejo 2\n- Consejo 3\n\n**Preguntas:**\n- Pregunta 1\n- Pregunta 2\n- Pregunta 3\nLa respuesta debe ser solo la lista, en español.";

            try {
                const text = await callGemini(prompt);
                geminiResult.textContent = text;
                geminiResult.style.display = 'block';
            } catch (error) {
                console.error('Error calling Gemini API:', error);
                geminiResult.textContent = 'Lo sentimos, no se pudieron generar los consejos en este momento. Por favor, inténtalo de nuevo más tarde.';
                geminiResult.style.display = 'block';
            } finally {
                geminiBtn.disabled = false;
                loader.style.display = 'none';
                geminiBtnText.textContent = '✨ Generar Consejos de Nuevo';
            }
        });

        async function callGemini(prompt, retries = 3, delay = 1000) {
            const apiKey = ""; // Canvas will provide the key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const payload = {
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            };

            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        return result.candidates[0].content.parts[0].text;
                    } else {
                        throw new Error('Invalid response structure from Gemini API');
                    }
                } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
                }
            }
        }

        // Initialize
        updateStepper();
    });