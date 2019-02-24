import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

function sendMessage(message, cb) {
    socket.on('connect', )
}

export {sendMessage};