import React, { useEffect, useMemo, useState } from 'react';
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
    const valid = useMemo(
        () =>
            props.validate(value, props.thing) && props.result === null,
        [value, props]
    )
    const fn = props.fn
    useEffect(() => {
        if (valid) {
            fn(value)
        }
    }, [valid, fn, value])
    return <div className="Accept">
        <textarea
            className="paste"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"

            onChange={e => setValue(e.target.value)}
            value={props.value}
            placeholder={`paste the ${props.thing} here to accept it`}
        ></textarea>
        <button
            onClick={async () => await fn(value)}
            disabled={!valid}
        >accept{props.result !== null ? "ed" : ""} {props.thing}
        </button>
    </div>
}

const ConnectionStep = props => {
    let instruct
    switch (props.step) {
        case 1:
            instruct = "create or accept an offer"
            break
        case 2:
            instruct = "give the offer to the other client"
            break
        case 3:
            instruct = "give the answer to the other client"
            break
        default:
            instruct = "???"
    }
    return <p
        className="ConnectionStep"
    >step {props.step}: {instruct}</p>
}

const ConnectionHandler = props => {

    const [localOffer, setLocalOffer] = useState(null)
    const [localAnswer, setLocalAnswer] = useState(null)

    const [remoteOffer, setRemoteOffer] = useState(null)
    const [remoteAnswer, setRemoteAnswer] = useState(null)

    const [step, setStep] = useState(1)

    const createOffer = async () => {
        setLocalOffer(await props.conn.createOffer())
        setStep(2)
    }
    const createAnswer = async () => {
        setLocalAnswer(await props.conn.createAnswer())
        setStep(4)
    }

    const acceptOffer = async offer => {
        props.conn.acceptRemote(offer)
        setRemoteOffer(offer)
        await createAnswer()
        setStep(3)
    }
    const acceptAnswer = answer => {
        props.conn.acceptRemote(answer)
        setRemoteAnswer(answer)
        // setStep(5)
    }


    return <div className="ConnectionHandler">
        <ConnectionStep step={step} />
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
                validate={props.conn.validate}
            />
            :
            <Accept
                thing="answer"
                result={remoteAnswer}
                fn={acceptAnswer}
                validate={props.conn.validate}
            />
        }
    </div>
}

export default ConnectionHandler