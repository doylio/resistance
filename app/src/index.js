import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';

import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {gameReducer} from './redux/reducers';


const logger = createLogger();
const store = createStore(gameReducer, applyMiddleware(logger));
 

ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));