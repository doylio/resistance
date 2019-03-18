import React, { Component } from 'react';
import {connect} from 'react-redux';
import deparam from 'deparam';
import Modal from 'react-responsive-modal';

import socket from '../utils/api';
import Icon from '../libs/icons/people.png';
import {addMessage, updatePeople} from '../redux/actions';
import Message from './Message';
import Setup from './Setup';
import Select from './Select';
import Vote from './Vote';
import Mission from './Mission';


const mapStateToProps = state => {
    return {
        people: state.people,
        messages: state.messages,
        action: state.act
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onNewMessage: (message) => dispatch(addMessage(message)),
        onUpdatePeople: (people) => dispatch(updatePeople(people)),
    };
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            result: undefined
        };
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

        let ActionsUI = (action) => {
            switch(action) {
                case 'ready':
                    return <Setup />;
                case 'choose-2':
                case 'choose-3':
                case 'choose-4':
                case 'choose-5':
                    return <Select />;
                case 'vote':
                    return <Vote />;
                case 'mission':
                    return <Mission />;
                default:
                    return <div></div>;
            }
        }

        let modalStyle = {
            modal:  this.state.result ? 'bg-primary p-4 rounded' : 'bg-danger p-4 rounded'
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
                        {this.props.people.map(user => <li key={user.id} className={user.action === null ? 'grey' : ''}>{user.name}</li>)}
                    </ul>
                    
                </div>
                <div className='game__log'>
                    <ol id="messages" className="game__messages">
                        {this.props.messages.map(data => {
                            return <Message message={data} key={data.createdAt} />;
                        })}
                    </ol>             
                </div>
                <div className='game__actions bg-secondary'>
                    <form id="message-form">
                        <input name="message" type="text" placeholder="Message" autoFocus autoComplete="off" />
                        <button className='btn btn-primary' onClick={this.onSendMessageButton}>Send</button>
                    </form>
                    {ActionsUI(this.props.action)}
                </div>
                <Modal classNames={modalStyle} open={this.state.open} onClose={this.onCloseModal} center >
                    <h2>{this.state.result ? 'Success!' : 'Sabotaged!'}</h2>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        socket.on('connect', function() {
            let params = deparam(window.location.search);
            params.name = params['?name'];
            params['?name'] = undefined;
            socket.emit('join', params, function(err, data) {
                if(err) {
                    alert(err);
                    window.location.href = '/';
                }
            });
        });
        socket.on('newMessage', (message) => {
            this.props.onNewMessage(message);
            scrollToBottom();
        });
        socket.on('update', data => {
            this.props.onUpdatePeople(data.userList);
        });
        socket.on('missionResult', result => {
            this.setState({
                open: true,
                result
            });
        });


        function scrollToBottom() {
            //Selectors
            let messages = document.querySelector("#messages");
            let newMessage = messages.lastElementChild;
            let lastMessage = newMessage.previousElementSibling;
            if(!messages || !newMessage || !lastMessage) {
                return;
            }
            //Heights
            let clientHeight = messages.clientHeight;
            let scrollTop = messages.scrollTop;
            let scrollHeight = messages.scrollHeight;
            let newMessageHeight = newMessage.clientHeight;
            let lastMessageHeight = lastMessage.clientHeight;
        
            if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                messages.scrollTop = scrollHeight;
            }
        }
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

    onCloseModal = () => {
        this.setState({open: false});
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);