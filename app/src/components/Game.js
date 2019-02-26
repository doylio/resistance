import React, { Component } from 'react';
import {connect} from 'react-redux';
import deparam from 'deparam';

import socket from '../utils/api';
import Icon from '../libs/icons/people.png';
import {addMessage, updatePeople} from '../redux/actions';
import Message from './Message';


const mapStateToProps = state => {
    return {
        people: state.people,
        messages: state.messages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onNewMessage: (message) => dispatch(addMessage(message)),
        onUpdatePeople: (people) => dispatch(updatePeople(people))
    };
}

class Game extends Component {
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
                        {this.props.messages.map(data => {
                            return <Message message={data} key={data.createdAt} />;
                        })}
                    </ol>             
                </div>
                <div className='game__actions'>
                    <form id="message-form">
                        <input name="message" type="text" placeholder="Message" autoFocus autoComplete="off" />
                        <button onClick={this.onSendMessageButton}>Send</button>
                    </form>
                </div>
            </div>
        );
    }

    componentDidMount() {
        socket.on('connect', function() {
            let params = deparam(window.location.search);
            socket.emit('join', params, function(err) {
                if(err) {
                    alert(err);
                    window.location.href = '/';
                }
            });
        });
        socket.on('newMessage', (message) => {
            this.props.onNewMessage(message);
        });
    }

    onSendMessageButton(e) {
        e.preventDefault();
        let messageBox = document.querySelector('[name=message]');
        socket.emit('createMessage', {
            text: messageBox.value
        }, () => {
            messageBox.value = '';
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);