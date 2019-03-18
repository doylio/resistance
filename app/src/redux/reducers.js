import {ADD_NEW_MESSAGE, UPDATE_PEOPLE, SAVE_SELF} from './constants';
import socket from '../utils/api';

const initialGameState = {
    people: [],
    messages: [],
    act: null,
    self: {},
};

export const gameReducer = (state=initialGameState, action={}) => {
    switch(action.type) {
        case ADD_NEW_MESSAGE:
            return Object.assign({}, state, {messages: state.messages.concat([action.payload])});
        case UPDATE_PEOPLE:
            let gameAction = action.payload.find(user => user.id === socket.id).action;
            return Object.assign({}, state, {people: action.payload, act: gameAction});
        case SAVE_SELF:
            return Object.assign({}, state, {self: action.payload});
        default:
            return state;
    }
}