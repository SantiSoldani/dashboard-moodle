class navBar extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('route-changed', () => this.render());
    }

    render() {
        const hash = window.location.hash.replace('#', '') || 'home';
        const isHome = hash === 'home';
        const isDataEntry = hash === 'data_entry';
        const isAlumnoStats = hash === 'alumno_stats';
        const rol = localStorage.getItem('rol') || 'Instructor';
        const nombre = localStorage.getItem('nombreUsuario') || '';

        let navLinks = '';
        if (rol === 'Administrador') {
            const isAdminDashboard = hash === 'admin_dashboard';
            const isAdminTools = hash === 'admin_tools';
            navLinks = `
                <li class="${isAdminDashboard ? 'active' : ''}"><a href="#admin_dashboard">📈 Dashboard General</a></li>
                <li class="${isAdminTools ? 'active' : ''}"><a href="#admin_tools">⚙️ Herramientas</a></li>
                <li class="${hash === 'tutores' ? 'active' : ''}"><a href="#tutores">👨‍🏫 Tutores</a></li>
                <li style="border-left: 1px solid #ccc; margin-left: 8px; padding-left: 8px;" class="${isHome ? 'active' : ''}"><a href="#home">📊 Panel Instructor</a></li>
                <li class="${isDataEntry ? 'active' : ''}"><a href="#data_entry">📁 Cargar Datos</a></li>
            `;
        } else if (rol !== 'Learner') {
            navLinks = `
                <li class="${isHome ? 'active' : ''}"><a href="#home">📊 Inicio</a></li>
                <li class="${isDataEntry ? 'active' : ''}"><a href="#data_entry">📁 Cargar Datos</a></li>
            `;
        } else {
            navLinks = `
                <li class="${isAlumnoStats ? 'active' : ''}"><a href="#alumno_stats">🧑‍🎓 Mi Panel</a></li>
            `;
        }

        this.innerHTML = ` 
        <nav class="admin-navbar">
            <ul class="nav-tabs">
                ${navLinks}
            </ul>
            <div class="teacher-profile" style="display: flex; align-items: center; gap: 16px;">
                <button id="fullscreen-btn" style="background: none; border: 1px solid var(--outline-variant, #c3c6d7); cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--on-surface-variant, #434655);" title="Alternar pantalla completa">
                    <svg id="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                    </svg>
                </button>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="teacher-avatar">${rol === 'Administrador' ? 'AD' : (rol === 'Learner' ? 'LN' : (rol === 'Tutor' ? 'TU' : 'IN'))}</div>
                    <div class="teacher-info">
                        <span>Hola ${nombre}!</span>
                    </div>
                </div>
            </div>
        </nav>
        `;

        this.attachFullscreenEvents();
    }

    attachFullscreenEvents() {
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

            // Evitamos agregar múltiples listeners si se re-renderiza
            if (!window.fullscreenListenerAdded) {
                document.addEventListener('fullscreenchange', () => {
                    const icon = document.querySelector('#fullscreen-icon');
                    const btn = document.querySelector('#fullscreen-btn');
                    if (!icon || !btn) return;

                    if (document.fullscreenElement) {
                        icon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
                        btn.title = 'Salir de pantalla completa';
                    } else {
                        icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
                        btn.title = 'Alternar pantalla completa';
                    }
                });
                window.fullscreenListenerAdded = true;
            }

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
customElements.define('component-navbar', navBar);
