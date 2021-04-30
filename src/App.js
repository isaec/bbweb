import React from 'react';
import './App.css';

let channel = null
const connection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

connection.ondatachannel = event => {
  console.log("ondatachannel")
  channel = event.channel
  channel.onopen = console.log
  channel.onmessage = console.log
}

console.log(connection)

const Avatar = () =>
  <svg viewBox="0 0 100 100" className="Avatar">
    <circle cx="50" cy="50" r="50" fill="pink" />
  </svg>

const Message = props =>
  <div className="message">
    {Avatar()}
    <div className="messageText">
      <p className="contactId">{props.name}</p>
      <p className="messageContent">{props.content}</p>
    </div>
  </div>

class ConnectionState extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      con: connection.connectionState,
      ice: connection.iceConnectionState
    }
    connection.onconnectionstatechange = () => this.setState({con: connection.connectionState})
    connection.oniceconnectionstatechange = () => this.setState({ice: connection.iceConnectionState})
  }
  render() {
    return <div className="ConnectionState">
      <p>connection state: {this.state.con}</p>
      <p>ice state: {this.state.ice}</p>
    </div>
  }
}

function App() {
  return (
    <div className="App">
      <ConnectionState />
      <Message name="bob" content="my message is long, but you shall hear it" />
      <Message name="bob" content="even if you do not like it" />
      <Message name="mark" content="really?" />
    </div>
  )
}

export default App;
