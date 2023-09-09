

//lado del cliente
const socket = io();

const title = document.getElementById('title');
const prodContainer = document.getElementById('productsContainer');
const products = document.getElementById('products');


let user = {
    rol : "admin"
}

Swal.fire({
    title: 'Identificacion de usuario',
    text: 'Por favor ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (valor) => {
        return !valor && 'Ingrese su nombre de usuario';
    },
    //esto es para que no pueda evitar el mensaje. Aparece la alerta y no puede evitarlo
    allowOutsideClick: false
}).then(resultado => {
    user.name = resultado.value;
    socket.emit('datosUsuario', user);

    socket.on('credencialesConexion', (info) => {
        if(info == 'usuario valido'){
            title.innerHTML = `Bienvenido : ${user.name}`;
        } else {
            title.innerHTML = `${info}`;
        }
    });

    socket.emit('autorizacionProductos', user.rol);
})






