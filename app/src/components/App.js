import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';


import Home from './Home';
import Game from './Game';
import Error from './Error';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/game' component={Game} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
