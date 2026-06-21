import { getBackendURL } from '../config.js';

export function initTutores() {
    setupAltaTutor();
    setupListadoTutores();
    setupAsignacionPanel();
    loadAlumnos();
}

function setupAltaTutor() {
    const btnAlta = document.getElementById('btnAltaTutor');
    const formAlta = document.getElementById('inlineAltaForm');
    const inputDni = document.getElementById('inputDniAlta');
    const btnConfirmar = document.getElementById('btnConfirmarAlta');
    const btnCancelar = document.getElementById('btnCancelarAlta');


    if (!btnAlta || !formAlta) return;

    btnAlta.addEventListener('click', () => {
        btnAlta.style.display = 'none';
        formAlta.style.display = 'flex';
        inputDni.focus();
    });

    btnCancelar.addEventListener('click', () => {
        formAlta.style.display = 'none';
        btnAlta.style.display = 'flex';
        inputDni.value = '';
    });

    btnConfirmar.addEventListener('click', async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            alert('Por favor, ingrese un DNI válido.');
            return;
        }

        const originalIcon = btnConfirmar.innerHTML;
        btnConfirmar.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>';
        btnConfirmar.disabled = true;

        try {
            const baseUrl = getBackendURL();
            const response = await fetch(`${baseUrl}/usuarios/${dni}/rol`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol: 'Tutor' })
            });

            if (!response.ok) throw new Error('Error al asignar rol de Tutor');

            alert(`Tutor con DNI ${dni} registrado exitosamente.`);

            // Ocultar formulario
            formAlta.style.display = 'none';
            btnAlta.style.display = 'flex';
            inputDni.value = '';

            // Refrescar página para ver listado actualizado
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al intentar registrar el tutor.');
        } finally {
            btnConfirmar.innerHTML = originalIcon;
            btnConfirmar.disabled = false;
        }
    });
}

async function loadAlumnos() {
    const alumnos_counter = document.getElementById('alumnos_counter');

    const baseUrl = getBackendURL();
    const response = await fetch(`${baseUrl}/alumnos/get`);
    if (!response.ok) throw new Error('Error al cargar alumnos');

    const data = await response.json();
    const alumnos = data.usuarios || data || [];
    alumnos_counter.textContent = alumnos.length;
}


async function loadTutores() {
    const tableBody = document.querySelector('.table-t tbody');
    const counterDisplay = document.getElementById('tutores_counter');
    if (!tableBody) return;

    try {
        const baseUrl = getBackendURL();
        const response = await fetch(`${baseUrl}/usuarios/rol/Tutor`);
        if (!response.ok) throw new Error('Error al cargar tutores');

        const data = await response.json();
        const tutores = data.usuarios || data || [];

        if (counterDisplay) {
            counterDisplay.textContent = tutores.length;
        }

        tableBody.innerHTML = '';

        if (tutores.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay tutores registrados.</td></tr>`;
            return;
        }

        // Recuperamos la cantidad de alumnos por cada tutor
        const tutoresConAlumnos = await Promise.all(tutores.map(async (tutor) => {
            let alumnosCount = 0;
            if (tutor.dni) {
                try {
                    const res = await fetch(`${baseUrl}/tutor_alumno/get/alumnos_by_tutor_dni/${tutor.dni}`);
                    if (res.ok) {
                        const alumnos = await res.json();
                        alumnosCount = alumnos.length || 0;
                    }
                } catch (err) {

                    console.error("Error al obtener alumnos para el tutor", tutor.dni, err);
                }
            }
            return { ...tutor, cantidad_alumnos: alumnosCount };
        }));

        tutoresConAlumnos.forEach(tutor => {
            const tr = document.createElement('tr');
            const apellido = tutor.apellido || '-';
            const nombre = tutor.nombre || '-';
            const email = tutor.email || '-';
            const dni = tutor.dni || 'Sin DNI';

            const alumnosCount = tutor.cantidad_alumnos || 0;
            const badgeClass = alumnosCount === 0 ? 'zero' : '';

            tr.innerHTML = `
                <td>${apellido}, ${nombre}</td>
                <td>${dni}</td>
                <td>${email}</td>
                <td><span class="badge-alumnos ${badgeClass}">${alumnosCount}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-asignar" data-tutor-id="${dni}" data-tutor="${nombre} ${apellido}"><span class="material-symbols-outlined">group_add</span> Asignar</button>
                        <button class="btn-icon btn-eliminar" data-tutor-id="${dni}"><span class="material-symbols-outlined">delete</span> Eliminar</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: red;">Error al cargar el listado.</td></tr>`;
    }
}

function setupListadoTutores() {
    loadTutores();

    const tableBody = document.querySelector('.table-t tbody');
    if (!tableBody) return;

    // Delegación de eventos para botones de asignar y eliminar
    tableBody.addEventListener('click', async (e) => {
        const btnAsignar = e.target.closest('.btn-asignar');
        const btnEliminar = e.target.closest('.btn-eliminar');

        if (btnAsignar) {
            const tutorName = btnAsignar.getAttribute('data-tutor');
            const tutorId = btnAsignar.getAttribute('data-tutor-id');
            abrirPanelAsignacion(tutorName, tutorId);
        }

        if (btnEliminar) {
            const row = btnEliminar.closest('tr');
            const tutorId = btnEliminar.getAttribute('data-tutor-id');
            if (confirm(`¿Está seguro que desea eliminar a este tutor y revocar sus asignaciones?`)) {

                const originalIcon = btnEliminar.innerHTML;
                btnEliminar.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>';
                btnEliminar.disabled = true;

                try {
                    const baseUrl = getBackendURL();
                    const response = await fetch(`${baseUrl}/tutores/${tutorId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) throw new Error('Error al eliminar tutor');

                    row.remove();
                    alert('Tutor eliminado exitosamente.');
                    loadTutores(); // Recargar contador y listado
                } catch (error) {
                    console.error(error);
                    alert('Error al eliminar el tutor.');
                    btnEliminar.innerHTML = originalIcon;
                    btnEliminar.disabled = false;
                }
            }
        }
    });
}

function abrirPanelAsignacion(tutorName) {
    const panel = document.getElementById('panelAsignacion');
    const nameSpan = document.getElementById('tutorAsignadoName');

    if (panel && nameSpan) {
        nameSpan.textContent = tutorName;
        // Guardamos un identificador en el panel
        panel.setAttribute('data-current-tutor', tutorName);

        // Reset de los checkboxes simulados
        const checkboxes = panel.querySelectorAll('.check-item-t input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById('selected-alumnos-count').textContent = '0 alumnos seleccionados';

        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupAsignacionPanel() {
    const panel = document.getElementById('panelAsignacion');
    if (!panel) return;

    const btnCerrar = document.getElementById('btnCerrarAsignacion');
    const btnCancelar = document.getElementById('btnCancelarAsignacion');
    const btnConfirmar = panel.querySelector('.btn-primary-large-t');
    const checkboxes = panel.querySelectorAll('.check-item-t input[type="checkbox"]');
    const countDisplay = document.getElementById('selected-alumnos-count');

    const cerrarPanel = () => {
        panel.style.display = 'none';
        panel.removeAttribute('data-current-tutor');
    };

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarPanel);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarPanel);

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const selectedCount = Array.from(checkboxes).filter(c => c.checked).length;
            countDisplay.textContent = `${selectedCount} alumnos seleccionados`;
        });
    });

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async () => {
            const selectedAlumnos = Array.from(checkboxes)
                .filter(cb => cb.checked);

            if (selectedAlumnos.length === 0) {
                alert('Debe seleccionar al menos un alumno para asignar.');
                return;
            }

            const tutorName = panel.getAttribute('data-current-tutor');

            const originalIcon = btnConfirmar.innerHTML;
            btnConfirmar.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Guardando...';
            btnConfirmar.disabled = true;

            try {
                const tutorId = "MOCK_TUTOR_ID"; // Ojo: Reemplazar por el ID real
                const estudiantesIds = [1, 2, 3]; // Ojo: Reemplazar por los IDs reales de los alumnos seleccionados
                const baseUrl = getBackendURL();

                const response = await fetch(`${baseUrl}/tutores/${tutorId}/asignar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estudiantes: estudiantesIds })
                });

                if (!response.ok) throw new Error('Error al asignar estudiantes');

                alert(`Se asignaron ${selectedAlumnos.length} estudiantes al tutor ${tutorName} exitosamente.`);
                cerrarPanel();
            } catch (error) {
                console.error(error);
                alert('Error al guardar la asignación.');
            } finally {
                btnConfirmar.innerHTML = originalIcon;
                btnConfirmar.disabled = false;
            }
        });
    }
}
