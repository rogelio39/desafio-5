const socket = io();

const form = document.getElementById('idForm');
const btnProducts = document.getElementById('btnProducts');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target); 
    const prod = Object.fromEntries(dataForm);
    socket.emit('nuevoProducto', prod);
    e.target.reset();
})


btnProducts.addEventListener('click', () => {
    socket.on('prod', (productos) => {
        console.log(productos);
    } )
})