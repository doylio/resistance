import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';


import Home from './components/Home';
import Game from './components/Game';
import Error from './components/Error';
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
