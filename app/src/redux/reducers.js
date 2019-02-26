import {ADD_NEW_MESSAGE, UPDATE_PEOPLE} from './constants';

const initialGameState = {
    people: [],
    messages: [],
};

export const gameReducer = (state=initialGameState, action={}) => {
    switch(action.type) {
        case ADD_NEW_MESSAGE:
            return Object.assign({}, state, {messages: state.messages.concat([action.payload])});
        case UPDATE_PEOPLE:
            return Object.assign({}, state, {people: action.payload});
        default:
            return state;
    }
}