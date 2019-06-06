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

class Messages extends Component {
  render() {
    return (
      <main className="messages">
        <Message messages={this.props.messages}/>
      </main>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: "Anonymous",
        color: randomColor()
        },
      usercount: 0,
      messages: [
        {
          id: 'madeupID1',
          type: 'message',
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id: 'madeupID2',
          type: 'message',
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        },
        {
          id: 'madeupID3',
          type: 'notification',
          content: "Anonymous set name to CatsInHats."
        }
      ]
    }
  }

  socket = new WebSocket(`ws://localhost:3001`);

  createMessage = (user, coloring, input) => {
    const newMessage = {
      type: 'message',
      username: user,
      content: input,
      styling: {color: coloring}
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  createNotification = (notification) => {
    const newMessage = {
      type: 'notification',
      content: notification
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  componentDidMount() {
    this.socket.onopen = event => {
      console.log("Connection Opened.")
    }

    this.socket.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      if (message.type === 'usercount') { this.setState({usercount: message.content}) }
      else {
      console.log(message);
      const messages = this.state.messages.concat(message)
      this.setState({messages})
    }
    }
  }

  render() {
    return (
      <fragment>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="usercountDisplay">{this.state.usercount} Users Online</div>
        </nav>
        <Messages messages={this.state.messages}/>
        <ChatBar
        createMessage={this.createMessage}
        createNotification={this.createNotification}
        currentUser={this.state.currentUser.name}
        userColor={this.state.currentUser.color}/>
      </fragment>
    );
  }
}
export default App;

function randomColor() {
    let colorList = ["#a8165c", "#a83a16", "#16a3a8", "#ad8c21"];
    return colorList[Math.floor(Math.random() * 4)];
}