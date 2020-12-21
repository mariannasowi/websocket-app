const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

const messages = [];
const users = [];
app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
    res.render(path.join(__dirname, '/client/index.html'));
  });

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });
const io = socket(server); 

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('newMessage', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
});

  socket.on('join', (user) => {
    console.log('Oh, we have a new user ' + socket.id);
    users.push(user);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${user.name} has joined the conversation!`
    })
    console.log(users);
  });
 
   socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    const user = users.find((user) => user.id == socket.id);
    const index = users.indexOf(user);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${user && user.name} has left the conversation... :(`,
    });
    users.splice(index, 1);
    });
    
  console.log('I\'ve added a listener on message event \n');
});
