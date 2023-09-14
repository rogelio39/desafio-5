const socket = io();

const chatButton = document.getElementById('chatButton');
const messageParagraph = document.getElementById('messageParagraph');
const inputValue = document.getElementById('chatBox');
const emailButton = document.getElementById('email');
const form = document.getElementById('form');

let user;
let email;



Swal.fire({
    title: "Identificación de usuario",
    text: "Por favor, ingrese su correo electrónico",
    input: "text",
    inputValidator: (valor) => {
        // Expresión para corroborar si es un email
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        if (!valor) {
            return "Ingrese un correo electrónico válido";
        } else if (!emailRegex.test(valor)) {
            return "Ingrese una dirección de correo electrónico válida (ejemplo@email)";
        }

        return null; // La validación es exitosa
    },
    allowOutsideClick: false
}).then((resultado) => {
    if (resultado.isConfirmed) {
        email = resultado.value;
        console.log(email);
    }
});




chatButton.addEventListener('click', () => {
    // let actualDate = new Date().toLocaleString();

    const message = inputValue.value;
    if(message.trim().length > 0){
        socket.emit('message', {email: email,  message: message})
        inputValue.value = '';
    }

});


socket.on('messages', (messages) => {
    messageParagraph.innerHTML = '';
    console.log(messages)
    messages.forEach(message => {
        messageParagraph.innerHTML += `<p>${message.email} escribio: ${message.message}. ${message.postTime}</p>`;
    })
})


