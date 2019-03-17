const socket = io();

function join(name) {
    socket.emit('join', {name, room: 'A'}, console.log);
}

socket.on('newMessage', console.log);
socket.on('update', console.log);
socket.on('storeUpdate', console.log);

socket.on('connect', function() {
    console.log('Connected!');
})