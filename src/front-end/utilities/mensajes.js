/**ARCHIVO DE FUNCIONES UTILES PARA TODO EL FRONT END */
function msj( texto, tipo = 'info', duracion = 3000, which_container) {

    const container = document.getElementById(which_container);

    if (!container) {
        console.error(
            `No existe el contenedor: ${which_container}`
        );
        return;
    }

    // CREAR MENSAJE
    const mensaje = document.createElement('div');

    // clase dinamica:
    // error / success / warning / info
    mensaje.classList.add(tipo);

    // TEXTO
    const contenido = document.createElement('span');

    contenido.textContent = texto;

    // BOTON
    const boton = document.createElement('button');

    boton.textContent = 'Ok';

    boton.addEventListener('click', () => {
        mensaje.remove();
    });

    // ARMAR MENSAJE
    mensaje.appendChild(contenido);

    mensaje.appendChild(boton);

    // INSERTAR EN EL HTML
    container.appendChild(mensaje);

    // AUTO ELIMINAR
    setTimeout(() => {

        if (mensaje.parentNode) {
            mensaje.remove();
        }

    }, duracion);
}