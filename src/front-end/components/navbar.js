class component_navbar extends HTMLElement {
    connectedCallback() {
        const isHome = window.location.pathname.includes('Home.html') || window.location.pathname.endsWith('/') || (!window.location.pathname.includes('data_entry.html') && !window.location.pathname.includes('Home.html'));
        const isDataEntry = window.location.pathname.includes('data_entry.html');

        this.innerHTML = ` 
        <nav class="admin-navbar">
            <ul class="nav-tabs">
                <li class="${isHome ? 'active' : ''}"><a href="Home.html">📊 Inicio</a></li>
                <li class="${isDataEntry ? 'active' : ''}"><a href="data_entry.html">📁 Cargar Datos</a></li>
            </ul>
            <div class="teacher-profile">
                <div class="teacher-avatar">CG</div>
                <div class="teacher-info">
                    <span>Moodle Docente</span>
                </div>
            </div>
        </nav>
        `;
    }
}
customElements.define('component-navbar', component_navbar);
