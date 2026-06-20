export function initAdminTools() {
    setupForm('formAltaAdmin', 'msgAdmin', 'Administrador registrado exitosamente.');
    setupForm('formCoeficientes', 'msgCoef', 'Coeficientes actualizados correctamente.');

    // Logic for auto-balancing sliders
    const coefAsistencia = document.getElementById('coefAsistencia');
    const coefTareas = document.getElementById('coefTareas');
    const coefExamenes = document.getElementById('coefExamenes');
    
    if (coefAsistencia && coefTareas && coefExamenes) {
        const sliders = [coefAsistencia, coefTareas, coefExamenes];
        const valDisplays = [
            document.getElementById('valAsistencia'),
            document.getElementById('valTareas'),
            document.getElementById('valExamenes')
        ];

        const updateDisplays = () => {
            sliders.forEach((slider, i) => {
                if (valDisplays[i]) {
                    valDisplays[i].textContent = parseFloat(slider.value).toFixed(1);
                }
            });
        };

        sliders.forEach((slider, index) => {
            slider.addEventListener('input', (e) => {
                let newVal = parseFloat(e.target.value);
                let others = sliders.filter((_, i) => i !== index);
                
                let targetSum = 3.0 - newVal;
                
                let val1 = parseFloat(others[0].value);
                let val2 = parseFloat(others[1].value);
                
                let currentSum = val1 + val2;
                if (currentSum === 0) {
                    val1 = targetSum / 2;
                    val2 = targetSum / 2;
                } else {
                    let ratio1 = val1 / currentSum;
                    let ratio2 = val2 / currentSum;
                    val1 = targetSum * ratio1;
                    val2 = targetSum * ratio2;
                }
                
                others[0].value = val1.toFixed(1);
                others[1].value = val2.toFixed(1);
                
                updateDisplays();
            });
        });

        // Form submit override to save locally
        const formCoef = document.getElementById('formCoeficientes');
        if (formCoef) {
            formCoef.addEventListener('submit', (e) => {
                localStorage.setItem('coefAsistencia', coefAsistencia.value);
                localStorage.setItem('coefTareas', coefTareas.value);
                localStorage.setItem('coefExamenes', coefExamenes.value);
            });
        }

        // Load saved coeficientes if any
        const savedAsis = localStorage.getItem('coefAsistencia');
        const savedTar = localStorage.getItem('coefTareas');
        const savedExa = localStorage.getItem('coefExamenes');

        if (savedAsis) coefAsistencia.value = savedAsis;
        if (savedTar) coefTareas.value = savedTar;
        if (savedExa) coefExamenes.value = savedExa;

        updateDisplays();
    }
}

function setupForm(formId, msgId, successText) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simular guardado
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Procesando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
            mostrarMensaje(msgId, successText, 'success');
        }, 800);
    });
}

function mostrarMensaje(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.textContent = text;
    el.className = `msg-feedback ${type === 'success' ? 'msg-success' : 'msg-error'}`;
    el.classList.remove('hidden');

    setTimeout(() => {
        el.classList.add('hidden');
    }, 4000);
}

// Add a simple spin animation for the loading state if not exists
const style = document.createElement('style');
style.textContent = `
    @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
