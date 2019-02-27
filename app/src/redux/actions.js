import {UPDATE_PEOPLE, ADD_NEW_MESSAGE, UPDATE_PHASE, TOGGLE_READY} from './constants';

export const updatePeople = (people) => ({
    type: UPDATE_PEOPLE,
    payload: people
});

export const addMessage = (message) => ({
    type: ADD_NEW_MESSAGE,
    payload: message
});

export const updatePhase = (phase) => ({
    type: UPDATE_PHASE,
    payload: phase
});

export const toggleReady = () => ({
    type: TOGGLE_READY
});