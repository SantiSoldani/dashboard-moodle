
const params = new URLSearchParams(window.location.search);

const tipo = params.get('tipo');
console.log('Tipo de iframe solicitado:', tipo);

const Iframe_tipes = {

    'home': {
        src: 'src/front-end/iframes/Home.html'
    },
    'data_entry': {
        src: 'src/front-end/iframes/data_entry.html'
    },
    'login': {
        src: 'src/front-end/iframes/Login.html'
    }
}

const target = Iframe_tipes[tipo] ? tipo : 'home';
window.location.href = Iframe_tipes[target].src;


