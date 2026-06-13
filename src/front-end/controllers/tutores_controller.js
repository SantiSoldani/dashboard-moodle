import { HandleGet_Tutor } from "../models/Tutor.js";
import { HandleGet_alumnos } from "../models/Alumno.js";

export async function initTutores() {
    // 1. Dar de Alta Tutor (Formulario Inline)
    const btnAlta = document.getElementById('btnAltaTutor');
    const inlineAltaForm = document.getElementById('inlineAltaForm');
    const btnConfirmarAlta = document.getElementById('btnConfirmarAlta');
    const btnCancelarAlta = document.getElementById('btnCancelarAlta');
    const inputDniAlta = document.getElementById('inputDniAlta');
    const tutores_counter = document.getElementById('tutores_counter')
    const alumnos_counter = document.getElementById('alumnos_counter')


    try {
        const tutores = await HandleGet_Tutor(null, "get");
        const alumnos = await HandleGet_alumnos(null, "get");
        const cantidadTutores = tutores.length;
        const cantidadAlumnos = alumnos.length;
        console.log("cantidadTutores", cantidadTutores);
        console.log("cantidadAlumnos", cantidadAlumnos);
        tutores_counter.textContent = cantidadTutores;
        alumnos_counter.textContent = cantidadAlumnos;
    } catch (error) {
        console.error(error);
        tutores_counter.textContent = "0";
    }

    if (btnAlta && inlineAltaForm) {
        btnAlta.addEventListener('click', () => {
            btnAlta.style.display = 'none';
            inlineAltaForm.style.display = 'flex';
            inputDniAlta.focus();
        });

        const closeInlineAlta = () => {
            inlineAltaForm.style.display = 'none';
            btnAlta.style.display = 'flex';
            inputDniAlta.value = ''; // Limpiar
        };

        if (btnCancelarAlta) btnCancelarAlta.addEventListener('click', closeInlineAlta);

        if (btnConfirmarAlta) {
            btnConfirmarAlta.addEventListener('click', () => {
                const which = "post";
                const dni = inputDniAlta.value.trim();
                if (dni) {
                    HandleGet_Tutor(dni, which)
                    closeInlineAlta();
                } else {
                    alert("Por favor, ingrese un DNI válido.");
                }
            });
        }
    }

    // 2. Panel de Asignación y Botones de Asignar
    const panelAsignacion = document.getElementById('panelAsignacion');
    const tutorNameSpan = document.getElementById('tutorAsignadoName');

    const botonesAsignar = document.querySelectorAll('.btn-asignar');
    botonesAsignar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tutorName = e.currentTarget.getAttribute('data-tutor');
            tutorNameSpan.textContent = tutorName;

            // Mostrar panel de asignación
            panelAsignacion.style.display = 'block';

            // Scroll suave hacia el panel
            panelAsignacion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // 3. Botones de Eliminar
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const confirm = window.confirm("¿Está seguro que desea eliminar este tutor?");
            if (confirm) {
                const dni = e.currentTarget.getAttribute('data-tutor');
                HandleGet_Tutor(dni, "delete");
            }
        });
    });

    // 4. Cerrar panel de asignación
    const closePanel = () => {
        panelAsignacion.style.display = 'none';
    };

    const btnCerrar = document.getElementById('btnCerrarAsignacion');
    const btnCancelar = document.getElementById('btnCancelarAsignacion');

    if (btnCerrar) btnCerrar.addEventListener('click', closePanel);
    if (btnCancelar) btnCancelar.addEventListener('click', closePanel);
}
