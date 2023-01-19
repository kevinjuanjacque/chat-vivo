const socket = io();
console.log('hola mundo desde cliente');
let user;
Swal.fire({
  title: 'Iniciar sesion',
  text: 'Para acceder debes estar autenticado',
  icon: 'success',
  confirmButtonText: 'Aceptar',
  input: 'text',
  inputLabel: 'Ingresa tu nombre',
  inputValidator: (value) => {
    if (!value) {
      return 'Debes ingresar minimo un caracter';
    }
    user = value;
  },
  allowOutsideClick: false,
}).then((result) => {
  socket.emit('new-user', { user: result.value });
  socket.on('new-user', (data) => {
    Swal.fire({
      title: 'Nuevo usuario conectado',
      text: `${data.user} se ha conectado`,
      toast: true,
      position: 'top-right',
    });
  });
  value = result.value;
});

[
  {
    user: 'kevin',
    message: 'hola mundo',
  },
];
socket.on('history', (data) => {
  console.log(data);
  let history = document.getElementById('history');
  data.forEach((item) => {
    history.innerHTML += `<div class=${
      item.user == user ? 'message-me' : ''
    }><p ><strong>${item.user}:</strong>${item.message}</p></div>`;
  });
});

const chatBox = document.getElementById('chatBox');

chatBox.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && e.target.value != '') {
    let message = e.target.value;
    socket.emit('message', {
      user,
      message,
    });
    e.target.value = '';
  }
});

socket.on('message', (data) => {
  let history = document.getElementById('history');
  history.innerHTML += `<div class="${
    data.user == user ? 'message-me' : ''
  }"><p><strong>${data.user}:</strong>${data.message}</p></div>`;
});
