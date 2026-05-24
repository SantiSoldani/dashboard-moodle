
const params = new URLSearchParams(window.location.search);

const tipo = params.get('tipo');
console.log('Tipo de iframe solicitado:', tipo);

const Iframe_tipes = {

    'home':{
        src: 'src/front-end/iframes/Home.html'
    },
    'data_entry':{
        src: 'src/front-end/iframes/data_entry.html'
    },
    'semaforo_alumnos':{
        src: 'src/front-end/iframes/semaforo_alumnos.html'
    },
    'all_students':{
        src: 'src/front-end/iframes/all_students.html'
    },
    //pendiente en agregar mas iframes en caso de necesitarlos
}

const target = Iframe_tipes[tipo] ? tipo : 'home';
window.location.href = Iframe_tipes[target].src;

/**function Handle_which_iframe(){

    const source = Iframe_tipes[tipo];

    if(!source){
        document.getElementById('iframe_container').innerHTML = '<p>Iframe no encontrado</p>';
        return;
    }

    const iframe = document.createElement('iframe');
    const conteiner = document.getElementById('iframe_container');

    conteiner.innerHTML = '';
    iframe.src = source.src;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';

    conteiner.appendChild(iframe);


    console.log('Iframe cargado:',{
        tipo: tipo,
        src: source.src
    });

}


window.addEventListener('load',Handle_which_iframe);

**/

