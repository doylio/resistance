import {UPDATE_PEOPLE, ADD_NEW_MESSAGE} from './constants';

export const updatePeople = (people) => ({
    type: UPDATE_PEOPLE,
    payload: people
});

export const addMessage = (message) => ({
    type: ADD_NEW_MESSAGE,
    payload: message
});
