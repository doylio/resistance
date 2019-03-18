import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from '../utils/api';

function mapStateToProps(state) {
    return {
        people: state.people,
        action: state.act
    };
}

class Select extends Component {
    constructor(props) {
        super(props);
        let players = this.props.people.map(player => {
            player.selected = false;
            return player;
        });
        this.state = { players };
    }
    render() {
        let teamSize = Number(this.props.action.slice(-1));
        let {players} = this.state;
        let playerButtons = players.map((user, i) => {
            if(user.selected) {
                return (<button onClick={() => this.toggleSelected(i)} className='btn btn-warning m-2' key={user.id} data-key={user.id}>{user.name}</button>);
            } else {
                return (<button onClick={() => this.toggleSelected(i)} className='btn btn-dark m-2 disabled' key={user.id} data-key={user.id}>{user.name}</button>);
            }
        });
        return (
            <div className='p-4'>
                <div className='d-flex flex-row flex-wrap'>
                    {playerButtons}
                </div>
                <div className='d-flex justify-content-end'>
                    {
                        this.state.players.filter(player => player.selected).length === teamSize ?
                        <button onClick={this.onSubmitTeam} className='btn btn-danger'>Submit Team</button>
                        : <button className='btn btn-danger disabled' disabled>Submit Team</button>
                    }
                </div>
            </div>
        );
    }

    toggleSelected = (i) => {
        let {players} = this.state;
        players[i].selected = !players[i].selected;
        this.setState({players});
    }

    onSubmitTeam = () => {
        let team = this.state.players.filter(user => user.selected).map(user => user.id);
        socket.emit('submitTeam', team, (err) => {
            if(err) {
                alert(err);
            }
        });
    }
}

export default connect(mapStateToProps, undefined)(Select);