import {UPDATE_PEOPLE, ADD_NEW_MESSAGE, SAVE_SELF} from './constants';

export const updatePeople = (people) => ({
    type: UPDATE_PEOPLE,
    payload: people
});

export const addMessage = (message) => ({
    type: ADD_NEW_MESSAGE,
    payload: message
});

export const saveSelf = (data) => ({
    type: SAVE_SELF,
    payload: data
});
