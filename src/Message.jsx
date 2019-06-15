import React, {Component} from 'react';

class Message extends Component {
  render() {
    const renderedMessages = this.props.messages.map( message => {
      if (message.type === 'message') {
        return (
          <div key={message.id} className="message">
            <span className="message-username" style={message.styling}>{message.username}</span>
            <span className="message-content">{message.content}</span>
          </div>
        );} else {
          return (
            <div className="notifyMessage" key={message.id}>{message.content}</div>
            );
        }
    })
    return (
      <fragment>{renderedMessages}</fragment>
    );
  }
}

export default Message;