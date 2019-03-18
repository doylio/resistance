import React, { Component } from 'react';

import socket from '../utils/api';

class Mission extends Component {
    render() {
        return (
            <div className='p-4'>
                <p className='text-light'>Choose to 'Assist' or 'Sabotage' the mission.  Note:  If you are resistance, both buttons will 'Assist', as resistance members cannot sabotage.</p>
                <div className='d-flex justify-content-around align-items-center'>
                    <button className='btn btn-primary' style={{width: '150px'}} onClick={this.assist}>
                        <h4>Assist</h4>
                    </button>
                    <button className='btn btn-danger' style={{width: '150px'}} onClick={this.sabotage}>
                        <h4>Sabotage</h4>
                    </button>
                </div>
            </div>
        );
    }

    assist = () => {
        socket.emit('mission', true, err => {
            if(err) {
                alert(err);
            }
        });
    }
    sabotage = () => {
        socket.emit('mission', false, err => {
            if(err) {
                alert(err);
            }
        });
    }
}

export default Mission;