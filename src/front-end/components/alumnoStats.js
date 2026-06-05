import { VISTA_ALUMNO_STATS } from '../Vistas.js';
import { initAlumnoStats } from '../controllers/Alumno_stats_controller.js';

class modalAlumnoStats extends HTMLElement {
    static get observedAttributes() {
        return ['alumno-dni'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const alumnoDni = this.getAttribute('alumno-dni') || '';
        if (!alumnoDni) {
            this.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #ffffff;">
                    <p style="font-family: 'Inter', sans-serif; color: #64748b; font-style: italic;">No se ha seleccionado ningún alumno.</p>
                </div>
            `;
            return;
        }

        // Renderizamos directamente la vista en lugar del iframe
        this.innerHTML = `   
            <div class="stats-container" style="position: relative; width: 100%; height: 100%; overflow-y: auto;">
                ${VISTA_ALUMNO_STATS}
            </div>
        `;

        // Inicializamos los datos estadísticos
        initAlumnoStats(alumnoDni);
    }
}

// Custom element names MUST be entirely lowercase to avoid browser DOMExceptions!
customElements.define('modal-alumnostats', modalAlumnoStats);   