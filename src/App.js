import React from 'react';
import './App.css';

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


function App() {
  return (
    <div className="App">
      <Message name="bob" content="my message is long, but you shall hear it" />
      <Message name="bob" content="even if you do not like it" />
      <Message name="mark" content="really?" />
    </div>
  )
}

export default App;
