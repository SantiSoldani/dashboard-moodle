
const params = new URLSearchParams(window.location.search);

const tipo = params.get('tipo');
console.log('Tipo de iframe solicitado:', tipo);

const Iframe_tipes = {

    'data_entry':{
        src: 'src/front-end/iframes/data_entry.html'
    },
    'semaforo_alumnos':{
        src: 'src/front-end/iframes/semaforo_alumnos.html'
    },
    //pendiente en agregar mas iframes en caso de necesitarlos
}


function Handle_which_iframe(){

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

    conteiner.appendChild(iframe);


    console.log('Iframe cargado:',{
        tipo: tipo,
        src: source.src
    });

}


window.addEventListener('load',Handle_which_iframe);



