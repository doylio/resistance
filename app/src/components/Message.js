import React from 'react';
import moment from 'moment';

const Message = ({message}) => {
    return (
        <li className="message">
            <div className="message__title">
                <h5>{message.from}</h5>
                <span>{moment(message.createdAt).format('h:mm a')}</span>
            </div>
            <div className="message__body">
                <p>{message.text}</p>
            </div>
        </li>
    );
};

export default Message;