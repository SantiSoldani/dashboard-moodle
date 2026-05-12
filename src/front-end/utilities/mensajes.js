/**ARCHIVO DE FUNCIONES UTILES PARA TODO EL FRONT END */

export function msj(msj, tipo,duracion = 3000, which_conteiner) {
    const msj_conteiner = document.getElementById(which_conteiner);
    msj_conteiner.appendChild(document.createTextNode(msj)).classList.add('tipo');
    msj_conteiner.appendChild(document.createElement('button')).textContent = 'Ok';
    msj.setTimeout(function() {
        if (msj_conteiner.lastChild.tagName === 'BUTTON') {
            msj_conteiner.removeChild(msj_conteiner.lastChild);
            msj_conteiner.removeChild(msj_conteiner.lastChild);
        }
    }, duracion);
}