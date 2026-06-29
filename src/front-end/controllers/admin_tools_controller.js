import { getBackendURL } from '../config.js';
import { Get_Database } from '../models/Files.js';
import { Post_Config_Iniciales, Post_Config_Cuatrimestrales, Post_Config_Materias } from '../models/config.js';

export function initAdminTools() {
    setupAltaAdminForm();
    setupValidationGroup(
        '.coef-input-iniciales', 6, 'sumaInicialesDisplay', 'Suma Total: $val / 6',
        'errorIniciales', 'btnGuardarIniciales'
    );
    setupForm('formCoefIniciales', 'msgIniciales', 'Coeficientes iniciales actualizados. Las configuraciones se implementarán a partir de la próxima encuesta.', async () => {
        const data = {
            pse: parseFloat(document.getElementById('coefSocioeconomico').value),
            ic: parseFloat(document.getElementById('coefInterrupcion').value),
            pep: parseFloat(document.getElementById('coefEducacionPadres').value),
            cv: parseFloat(document.getElementById('coefCargaVital').value),
            cl: parseFloat(document.getElementById('coefCargaLaboral').value),
            loc: parseFloat(document.getElementById('coefLocalizacion').value)
        };
        return await Post_Config_Iniciales(data);
    });

    setupValidationGroup(
        '.coef-input-cuatri', 2, 'sumaCuatriDisplay', 'Suma Total: $val / 2',
        'errorCuatri', 'btnGuardarCuatri'
    );
    setupForm('formCoefCuatri', 'msgCuatri', 'Coeficientes cuatrimestrales actualizados. Las configuraciones se implementarán a partir de la próxima encuesta.', async () => {
        const data = {
            rap: parseFloat(document.getElementById('coefRendPercibido').value),
            rac: parseFloat(document.getElementById('coefRendCuantitativo').value)
        };
        return await Post_Config_Cuatrimestrales(data);
    });

    setupValidationGroupMulti(
        ['.coef-input-mat1', '.coef-input-mat2'],
        [3, 4],
        ['sumaMat1Display', 'sumaMat2Display'],
        ['Suma Grupo 1: $val / 3', 'Suma Grupo 2: $val / 4'],
        ['errorMat1', 'errorMat2'],
        'btnGuardarMaterias'
    );
    setupForm('formPesosMaterias', 'msgMaterias', 'Pesos de materias actualizados. Las configuraciones se implementarán a partir de la próxima carga de notas.', async () => {
        const data = {
            mate1: parseFloat(document.getElementById('pesoMat1').value),
            algebra1: parseFloat(document.getElementById('pesoAlg1b').value),
            fdlq: parseFloat(document.getElementById('pesoFundQuimica').value),
            mate2: parseFloat(document.getElementById('pesoMat2').value),
            algebra2: parseFloat(document.getElementById('pesoAlg2').value),
            fdlp: parseFloat(document.getElementById('pesoFundProg').value),
            fisica: parseFloat(document.getElementById('pesoFisicaA').value)
        };
        return await Post_Config_Materias(data);
    });

    const btnDescargar = document.getElementById('btnDescargarDB');
    if (btnDescargar) {
        btnDescargar.addEventListener('click', async () => {
            const originalText = btnDescargar.innerHTML;
            btnDescargar.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Descargando...';
            btnDescargar.disabled = true;

            const success = await Get_Database();
            if (success) {
                mostrarMensaje('msgDescargaDB', 'Descarga completada con éxito.', 'success');
            } else {
                mostrarMensaje('msgDescargaDB', 'Error al descargar la base de datos.', 'error');
            }

            btnDescargar.innerHTML = originalText;
            btnDescargar.disabled = false;
        });
    }
}

function setupValidationGroup(inputSelector, targetSum, displayId, displayText, errorId, buttonId) {
    const inputs = document.querySelectorAll(inputSelector);
    if (!inputs.length) return;
    const display = document.getElementById(displayId);
    const errorEl = document.getElementById(errorId);
    const btn = document.getElementById(buttonId);

    const validate = () => {
        let sum = 0;
        inputs.forEach(inp => sum += parseFloat(inp.value) || 0);
        sum = Math.round(sum * 100) / 100;

        if (display) display.textContent = displayText.replace('$val', sum.toFixed(2));

        if (sum !== targetSum) {
            if (errorEl) errorEl.style.display = 'block';
            if (btn) btn.disabled = true;
            if (btn) btn.style.opacity = '0.5';
            if (btn) btn.style.cursor = 'not-allowed';
            return false;
        } else {
            if (errorEl) errorEl.style.display = 'none';
            if (btn) btn.disabled = false;
            if (btn) btn.style.opacity = '1';
            if (btn) btn.style.cursor = 'pointer';
            return true;
        }
    };

    inputs.forEach(inp => {
        inp.addEventListener('input', validate);
    });

    validate();
}

function setupValidationGroupMulti(inputSelectors, targetSums, displayIds, displayTexts, errorIds, buttonId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    const validateAll = () => {
        let allValid = true;
        for (let i = 0; i < inputSelectors.length; i++) {
            const inputs = document.querySelectorAll(inputSelectors[i]);
            const targetSum = targetSums[i];
            const display = document.getElementById(displayIds[i]);
            const errorEl = document.getElementById(errorIds[i]);

            let sum = 0;
            inputs.forEach(inp => sum += parseFloat(inp.value) || 0);
            sum = Math.round(sum * 100) / 100;

            if (display) display.textContent = displayTexts[i].replace('$val', sum.toFixed(2));

            if (sum !== targetSum) {
                if (errorEl) errorEl.style.display = 'block';
                allValid = false;
            } else {
                if (errorEl) errorEl.style.display = 'none';
            }
        }

        if (!allValid) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    };

    for (let i = 0; i < inputSelectors.length; i++) {
        const inputs = document.querySelectorAll(inputSelectors[i]);
        inputs.forEach(inp => inp.addEventListener('input', validateAll));
    }

    validateAll();
}

function setupForm(formId, msgId, successText, submitAction) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Procesando...';
        submitBtn.disabled = true;

        try {
            let success = true;
            if (submitAction) {
                success = await submitAction();
            } else {
                // Simular guardado
                await new Promise(r => setTimeout(r, 800));
            }

            if (success) {
                mostrarMensaje(msgId, successText, 'success');
                // Note: we don't reset the form values so the user sees the saved coefficients
            } else {
                mostrarMensaje(msgId, 'Error al guardar los coeficientes.', 'error');
            }
        } catch (error) {
            console.error(error);
            mostrarMensaje(msgId, 'Excepción al intentar guardar.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
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

function setupAltaAdminForm() {
    const form = document.getElementById('formAltaAdmin');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const dniInput = document.getElementById('adminDni').value;

        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Procesando...';
        submitBtn.disabled = true;

        try {
            const baseUrl = getBackendURL();
            const response = await fetch(`${baseUrl}/usuarios/${dniInput}/rol`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol: 'Administrador' })
            });

            if (!response.ok) throw new Error('Error al actualizar rol');

            form.reset();
            mostrarMensaje('msgAdmin', 'Administrador registrado exitosamente.', 'success');
        } catch (error) {
            console.error(error);
            mostrarMensaje('msgAdmin', 'Error al registrar administrador.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
