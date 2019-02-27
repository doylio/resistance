import React, { Component } from 'react';
import { connect } from 'react-redux';

import {toggleReady} from '../redux/actions';
import socket from '../utils/api';

function mapStateToProps(state) {
    return {
        ready: state.ready
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleReady: () => dispatch(toggleReady())
    };
}

class Setup extends Component {
    render() {
        return (
            <div className='d-flex p-4 '>
                {
                    this.props.ready 
                    ?
                    <button className='btn btn-warning disabled' onClick={this.onReadyButton}>
                        <h4>Ready</h4>
                    </button>
                    :
                    <button className='btn btn-warning' onClick={this.onReadyButton}>
                        <h4>Ready Up</h4>
                    </button>
                }
            </div>
        );
    }

    onReadyButton = () => {
        socket.emit('updateReady', !this.props.ready, () => {
            this.props.toggleReady();
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup);