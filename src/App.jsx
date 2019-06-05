import React, {Component} from 'react';


class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.currentUser
    }
  }

  setUser = event => {
    this.setState({user: event.target.value});
  }

  formSubmit = evt => {
    if(evt.keyCode == 13){
      evt.preventDefault();
      const input = evt.target.value;
      const user = this.state.user;
      this.props.createMessage(user, input);
      evt.target.value = "";
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input onChange={this.setUser} className="chatbar-username" placeholder={this.state.user} />
        <input onKeyDown={this.formSubmit} className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

class Messages extends Component {
  render() {
    return (
      <main className="messages">
        <Message messages={this.props.messages}/>
        <div className="message system">
            Anonymous1 changed their name to nomnom.
        </div>
      </main>
    );
  }
}

class Message extends Component {
  render() {
    const renderedMessages = this.props.messages.map((message, index) => {
      return (<div key={index} className="message">
              <span className="message-username">{message.username}</span>
              <span className="message-content">{message.content}</span>
            </div>)
    })
    return (
      <fragment>{renderedMessages}</fragment>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"},
      messages: [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
  }

  socket = new WebSocket(`ws://localhost:3001`);

  createMessage = (user, input) => {
    const newMessage = {
      username: user,
      content: input
    };
    // Sets a new message state in React:
    // const messages = this.state.messages.concat(newMessage)
    // this.setState({messages})
    this.socket.send(JSON.stringify(newMessage));
  }

  componentDidMount() {
    this.socket.onopen = event => {
      console.log("Connection Opened.")
    }

    this.socket.onmessage = evt => {
    // on receiving a message, add it to the list of messages
    const message = JSON.parse(evt.data)
    console.log(message);
    const messages = this.state.messages.concat(message)
    this.setState({messages})
    }
  }

  render() {
    return (
<fragment>
  <nav className="navbar">
    <a href="/" className="navbar-brand">Chatty</a>
  </nav>
  <Messages messages={this.state.messages}/>
  <ChatBar createMessage={this.createMessage}currentUser={this.state.currentUser.name} />
</fragment>
    );
  }
}
export default App;

