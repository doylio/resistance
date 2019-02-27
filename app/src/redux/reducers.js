import {ADD_NEW_MESSAGE, UPDATE_PEOPLE, UPDATE_PHASE, TOGGLE_READY} from './constants';

const initialGameState = {
    people: [],
    messages: [],
    phase: '',
    ready: false
};

export const gameReducer = (state=initialGameState, action={}) => {
    switch(action.type) {
        case ADD_NEW_MESSAGE:
            return Object.assign({}, state, {messages: state.messages.concat([action.payload])});
        case UPDATE_PEOPLE:
            return Object.assign({}, state, {people: action.payload});
        case UPDATE_PHASE:
            return Object.assign({}, state, {phase: action.payload});
        case TOGGLE_READY:
            return Object.assign({}, state, {ready: !state.ready});
        default:
            return state;
    }
}