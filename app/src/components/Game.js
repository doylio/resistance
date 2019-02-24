import React, { Component } from 'react';

class Game extends Component {
    render() {
        return (
            <div className='game'>
                <div className='game__sidebar'>
                    Sidebar
                </div>
                <div className='game__log'>
                    Logs
                </div>
                <div className='game__actions'>
                    Actions
                </div>
            </div>
        );
    }
}

export default Game;