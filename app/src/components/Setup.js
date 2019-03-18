import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from '../utils/api';

class Setup extends Component {
    render() {
        return (
            <div className='d-flex p-4 '>
                <button className='btn btn-warning' onClick={this.onReadyButton}>
                    <h4>Ready</h4>
                </button>
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