import React from 'react';
import './App.css'
import "./common.css"
import Connection from './connection';
import ConnectionHandler from "./components/connectionHandler/ConnectionHandler"

import Chat from "./components/chat/Chat"

const connection = new Connection()

function App() {
    return (
        <div className="App">
            <ConnectionHandler conn={connection}/>
            <Chat conn={connection}/>
        </div>
    )
}

export default App;
