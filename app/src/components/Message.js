import React from 'react';

const Message = ({message}) => {
    return (
        <li key={message.createdAt} className="message">
            <div className="message__title">
                <h5>{message.from}</h5>
                <span>{message.createdAt}</span>
            </div>
            <div className="message__body">
                <p>{message.text}</p>
            </div>
        </li>
    );
};

export default Message;