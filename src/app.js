const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const routerViews = require('./router/views.router');

const app = express();
const httpServer = app.listen(8080, () => {
  console.log('server is running on port 8080');
});
const io = new Server(httpServer);
const msgs = [
  {
    user: 'kevin',
    message: 'hola mundo',
  },
];
io.on('connection', (socket) => {
  console.log('nueva usuario conectado');
  // {
  //   user: 'kevin',
  //   message: 'hola mundo'
  // }
  socket.on('new-user', (data) => {
    socket.broadcast.emit('new-user', data);
  });
  socket.emit('history', msgs);
  socket.on('message', (data) => {
    msgs.push(data);
    io.emit('message', data);
  });
});

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/', routerViews);
