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

        // Clean stats container without complex scaling or transforms
        this.innerHTML = `   
            <div class="iframe-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
                <!-- Modern Minimalist Loader Overlay -->
                <div id="modal-iframe-loader" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; gap: 16px; z-index: 5; transition: opacity 0.25s ease, visibility 0.25s;">
                    <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #004ac6; border-radius: 50%; animation: modal-spin 1s linear infinite;"></div>
                    <span style="font-family: 'Inter', sans-serif; font-size: 15px; color: #475569; font-weight: 500;">Cargando ficha académica...</span>
                </div>
                
                <!-- Dynamic statistics iframe (Resolves relative to Home.html in front-end/iframes/) -->
                <iframe 
                    id="modal-stats-iframe"
                    src="Alumnos_stats.html" 
                    style="width: 100%; height: 100%; border: none; opacity: 0; transition: opacity 0.25s ease;"
                    onload="handleIframeLoad()"
                ></iframe>
            </div>
            
            <style>
                @keyframes modal-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Safely bind the onload handler
        const iframe = this.querySelector('#modal-stats-iframe');
        const loader = this.querySelector('#modal-iframe-loader');
        
        window.handleIframeLoad = () => {
            if (iframe && loader) {
                iframe.style.opacity = '1';
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.style.display = 'none';
                    }
                }, 250);
            }
        };
    }
}

// Custom element names MUST be entirely lowercase to avoid browser DOMExceptions!
customElements.define('modal-alumnostats', modalAlumnoStats);