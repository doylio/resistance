import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import openSocket from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';


const socket = openSocket('http://localhost:8080');

socket.on('connect', function() {
    console.log('connected');
});

ReactDOM.render(<App />, document.getElementById('root'));