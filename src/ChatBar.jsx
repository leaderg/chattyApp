import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser,
      color: this.props.userColor
    }
  }

  setUser = event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      let notification = this.state.user + " has changed their name to " + event.target.value;
      this.setState({user: event.target.value});
      this.props.createNotification(notification);

    }
  }

  formSubmit = evt => {
    if(evt.keyCode == 13){
      evt.preventDefault();
      const input = evt.target.value;
      const user = this.state.user;
      const color = this.state.color;
      this.props.createMessage(user, color, input);
      evt.target.value = "";
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input onKeyDown={this.setUser} className="chatbar-username" placeholder={this.state.user} />
        <input onKeyDown={this.formSubmit} className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

export default ChatBar;