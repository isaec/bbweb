import React, { useState } from 'react';
import "../../common.css"
import "./ConnectionHandler.css"

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

    const createOffer = async () => setLocalOffer(await props.conn.createOffer())
    const createAnswer = async () => setLocalAnswer(await props.conn.createAnswer())

    const acceptOffer = async offer => {
        props.conn.acceptRemote(offer)
        setRemoteOffer(offer)
        setLocalAnswer(await props.conn.createAnswer())
    }
    const acceptAnswer = answer => {
        props.conn.acceptRemote(answer)
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

export default ConnectionHandler