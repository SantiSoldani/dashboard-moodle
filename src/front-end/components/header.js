class header extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';

        this.innerHTML = `
        <header class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div>
                <h1>${title}</h1>
                <p class="subtitle">${subtitle}</p>
                <p id="currentDate" style="font-weight: 600; color: #3b82f6; margin-top: 6px; font-size: 0.92rem;"></p>
            </div>
            <button id="fullscreen-btn" style="background: none; border: 1px solid var(--outline-variant, #c3c6d7); cursor: pointer; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--on-surface-variant, #434655);" title="Alternar pantalla completa">
                <svg id="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
            </button>
        </header>
        `;

        const fsBtn = this.querySelector('#fullscreen-btn');
        const fsIcon = this.querySelector('#fullscreen-icon');

        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });

            document.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    fsIcon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
                    fsBtn.title = 'Salir de pantalla completa';
                } else {
                    fsIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
                    fsBtn.title = 'Alternar pantalla completa';
                }
            });

            fsBtn.addEventListener('mouseenter', () => {
                fsBtn.style.backgroundColor = 'var(--surface-container-low, #f1f3ff)';
                fsBtn.style.color = 'var(--primary, #004ac6)';
                fsBtn.style.borderColor = 'var(--primary, #004ac6)';
            });
            fsBtn.addEventListener('mouseleave', () => {
                fsBtn.style.backgroundColor = 'transparent';
                fsBtn.style.color = 'var(--on-surface-variant, #434655)';
                fsBtn.style.borderColor = 'var(--outline-variant, #c3c6d7)';
            });
        }
    }
}
customElements.define('component-header', header);
