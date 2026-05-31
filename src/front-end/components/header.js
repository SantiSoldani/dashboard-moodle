class header extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';

        this.innerHTML = `
        <header class="page-header">
            <div>
                <h1>${title}</h1>
                <p class="subtitle">${subtitle}</p>
                <p id="currentDate" style="font-weight: 600; color: #3b82f6; margin-top: 6px; font-size: 0.92rem;"></p>
            </div>
        </header>
        `;
    }
}
customElements.define('component-header', header);
