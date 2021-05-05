import React, { useState } from 'react';
import './App.css'
import "./common.css"
import Connection from './connection';

import Chat from "./Chat"

const connection = new Connection()


const Create = props => <div className="Create">
    <code className="copy">{props.result}</code>
    <button
        onClick={async () => await props.fn()}
        disabled={props.result !== null}
    >create{props.result !== null ? "d" : ""} {props.thing}
    </button>
</div>


const Accept = props => {
    const [value, setValue] = useState("")
    return <div className="Accept">
        <textarea
            className="paste"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"

            onChange={e => setValue(e.target.value)}
            value={value}
            placeholder={`paste the ${props.thing} here to accept it`}
        ></textarea>
        <button
            onClick={async () => await props.fn(value)}
            disabled={value < 1 || props.result !== null}
        >accept{props.result !== null ? "ed" : ""} {props.thing}
        </button>
    </div>
}

const ConnectionHandler = props => {

    const [localOffer, setLocalOffer] = useState(null)
    const [localAnswer, setLocalAnswer] = useState(null)

    const [remoteOffer, setRemoteOffer] = useState(null)
    const [remoteAnswer, setRemoteAnswer] = useState(null)

    const createOffer = async () => setLocalOffer(await connection.createOffer())
    const createAnswer = async () => setLocalAnswer(await connection.createAnswer())

    const acceptOffer = async offer => {
        connection.acceptRemote(offer)
        setRemoteOffer(offer)
        setLocalAnswer(await connection.createAnswer())
    }
    const acceptAnswer = answer => {
        connection.acceptRemote(answer)
        setRemoteAnswer(answer)
    }


    return <div className="ConnectionHandler">
        {remoteOffer === null ?
            <Create
                thing="offer"
                result={localOffer}
                fn={createOffer}
            />
            :
            <Create
                thing="answer"
                result={localAnswer}
                fn={createAnswer}
            />
        }
        {localOffer === null ?
            <Accept
                thing="offer"
                result={remoteOffer}
                fn={acceptOffer}
            />
            :
            <Accept
                thing="answer"
                result={remoteAnswer}
                fn={acceptAnswer}
            />
        }
    </div>
}


function App() {
    return (
        <div className="App">
            <ConnectionHandler />
            <Chat conn={connection}/>
        </div>
    )
}

export default App;
