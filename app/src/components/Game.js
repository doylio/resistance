import React, { Component } from 'react';
import Icon from '../libs/icons/people.png';
import openSocket from 'socket.io-client';
import Message from './Message';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    componentWillMount() {
        console.log(this.state.messages)
        const socket = openSocket('http://localhost:8080');
        socket.on('connect', function() {
            console.log('connected');
        });
        socket.on('newMessage', this.pushMessageToState);
        let {messages} = this.state;
        let data = {
            from: "Shawn",
            text: "Happy Birthday",
            createdAt: "7:35am"
        }
        messages.push(<Message message={data} />);

    }

    pushMessageToState(message) {
        let {messages} = this.state;
        messages.push(<Message message={message} />);
        this.setState({messages});
    }

    render() {
        const togglePeople = () => {
            const people = document.querySelector('#people');
            if(people.style.top === '-100%') {
                people.style.top = '49px';
            } else {
                people.style.top = '-100%';
            }
        }
        
        return (
            <div className='game'>
                <div className='game__sidebar'>
                    <div id='title' className='container-fluid'>
                        <div id='icon' onClick={togglePeople} >
                            <img src={Icon} alt='List players button' width='50px' height='auto' />
                        </div>
                        <h3 className='text-center text-light pt-2'>Game</h3>
                    </div>
                    <ul id='people'>
                        <li>Shawn</li>
                        <li>Devin</li>
                        <li>Cameron</li>
                        <li>Colin</li>
                        <li>Eric</li>
                    </ul>
                    
                </div>
                <div className='game__log'>
                    <ol id="messages" className="game__messages">
                        {this.state.messages}
                    </ol>             
                </div>
                <div className='game__actions'>
                    Actions
                </div>
            </div>
        );
    }
}

export default Game;