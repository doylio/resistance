import React, { Component } from 'react';

import socket from '../utils/api';

class Setup extends Component {
    render() {
        return (
            <div className='p-4'>
                <p className='text-light'>Press ready when all players are present.</p>
                <div className='d-flex'>
                    <button className='btn btn-warning' onClick={this.onReadyButton}>
                        <h4>Ready</h4>
                    </button>
                </div>
            </div>
        );
    }

    onReadyButton = () => {
        socket.emit('updateReady', true, err => {
            if(err) {
                alert(err);
            }
        });
    }
}

export default Setup;