import React, { Component } from 'react';

class Home extends Component {
    render() {
        return (
            <div className='home container d-flex justify-content-center align-content-center'>
                <div className="card text-center bg-dark text-light p-3" style={{width: '18rem', marginTop: '10rem'}}>
                    <form action='/game'>
                        <div className="form-field">
                            <h3>Join a game</h3>
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">Display name</label>
                            <input type="text" name="name" autoFocus autoComplete="off" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="game">Game name</label>
                            <input type="text" name="game" autoComplete="off"/>
                        </div>
                        <div className="form-field">
                            <button className='btn btn-warning'>Join</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Home;