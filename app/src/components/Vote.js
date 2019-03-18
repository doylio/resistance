import React, { Component } from 'react';

import socket from '../utils/api';

class Vote extends Component {
    render() {
        return (
            <div className='p-4'>
                <p className='text-light'>Vote on whether this team should proceed with the mission</p>
                <div className='d-flex justify-content-around align-items-center'>
                    <button className='btn btn-primary' style={{width: '150px'}} onClick={this.yes}>
                        <h4>Yes</h4>
                    </button>
                    <button className='btn btn-danger' style={{width: '150px'}} onClick={this.no}>
                        <h4>No</h4>
                    </button>
                </div>
            </div>
        );
    }

    yes = () => {
        socket.emit('vote', true, err => {
            if(err) {
                alert(err);
            }
        });
    }
    no = () => {
        socket.emit('vote', false, err => {
            if(err) {
                alert(err);
            }
        });
    }
}

export default Vote;