import React, { useState, useMemo } from 'react';
import './App.css';
import Connection from './connection';

import MessageData from "./MessageData"

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

// class ConnectionHandler extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             localOffer: null,
//             localAnswer: null,
//             remoteOffer: null,
//             remoteAnswer: null
//         }
//     }

// async do(thing, data) {
//     switch (thing) {
//         case Connection.ops.createOffer:
//             const offer = await connection.createOffer()
//             this.setState({ localOffer: offer })
//             break
//         case Connection.ops.createAnswer:
//             alert("unused path")
//             const answer = await connection.createAnswer()
//             this.setState({ localAnswer: answer })
//             break
//         case Connection.ops.acceptOffer:
//             connection.acceptRemote(data)
//             const answer = await connection.createAnswer()
//             this.setState({ remoteOffer: data, localAnswer: })
//             break
//         case Connection.ops.acceptAnswer:
//             connection.acceptRemote(data)
//             this.setState({ remoteAnswer: data })
//             break
//         default:
//             console.log(thing, data)
//     }
// }

//     render() {
//         return <div className="ConnectionHandler">
//             {this.state.remoteOffer === null ?
//                 <Create
//                     thing="offer"
//                     result={this.state.localOffer}
//                     fn={this.do.bind(this, Connection.ops.createOffer)}
//                 />
//                 :
//                 <Create
//                     thing="answer"
//                     result={this.state.localAnswer}
//                     fn={this.do.bind(this, Connection.ops.createAnswer)}
//                 />
//             }
//             {this.state.localOffer === null ?
//                 <Accept
//                     thing="offer"
//                     result={this.state.remoteOffer}
//                     fn={this.do.bind(this, Connection.ops.acceptOffer)}
//                 />
//                 :
//                 <Accept
//                     thing="answer"
//                     result={this.state.remoteAnswer}
//                     fn={this.do.bind(this, Connection.ops.acceptAnswer)}
//                 />
//             }
//         </div>
//     }
// }

const hsl = (hue, sat, light) => `hsl(${hue},${sat || 90}%,${light || 70}%)`

const Avatar = props =>
    <svg viewBox="0 0 100 100" className="Avatar">
        <circle cx="50" cy="50" r="50" fill={hsl(props.hue)} />
        <text
            className="noselect"
            x="50" y="50"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="4em"
            textLength="80"
            fill={hsl(props.hue, null, 15)}
        >{props.char}</text>
    </svg>

const Message = props =>
    <div className="Message">
        <Avatar hue={props.hue} char={props.name[0]} />
        <div className="messageText">
            <p className="name" style={{ color: hsl(props.hue) }}>{props.name}</p>
            <p className="messageContent">{props.content}</p>
        </div>
    </div>

const MessageAlert = props =>
    <div className="MessageAlert">
        <p
            style={{ color: hsl(props.hue) }}
        >{props.content}</p>
    </div>

const Messages = props => {
    const messageList = props.messages.map(
        message =>
            <Message
                key={message.id}
                hue={message.hue}
                name={message.name}
                content={message.content}
            />
    )
    return <div className="Messages">
        <MessageAlert hue="40" content="local history begins" />
        {messageList}
    </div>
}

const ComposeMessage = props => {
    const [value, setValue] = useState("")

    const rows = useMemo(() => Math.min(value.split(/\n/).length, 10), [value])
    const hasContent = useMemo(() => /\p{L}/u.test(value), [value])

    const connected = props.conState === "connected"

    const canSend = hasContent && connected

    const send = () => {
        setValue("")
        props.send(value)
    }

    return <div className="ComposeMessage">
        <textarea
            className="messageBox"
            autoComplete="off"
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck="true"

            disabled={!connected}

            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey && canSend) {
                    e.preventDefault()
                    send()
                }
            }}
            value={value}
            placeholder="type a message to the group"
            rows={rows}
        ></textarea>
        <button
            onClick={send}
            disabled={!canSend}
        >send</button>
    </div>
}

const ConnectionState = props =>
    <div className="ConnectionState">
        <p className="connection">connection state: {props.con}</p>
        <p className="connection">ice state: {props.ice}</p>
    </div>

const IdentityEditor = props => <div
    className="IdentityEditor"
>
    <Message
        hue={props.hue}
        name={props.name}
        content={props.demoContent}
    />
    <div
        className="inputWrapper"
    >
        <label
            htmlFor="hue"
        >hue</label>
        <input
            type="range"
            name="hue"
            min="0"
            max="360"
            value={props.hue}
            className="hue"

            onChange={e => props.setHue(e.target.value)}
        />
    </div>
</div>

const ChatHeader = props => <div
    className="ChatHeader"
>
    <IdentityEditor
        hue={props.hue} setHue={props.setHue}
        name={props.name} setName={props.setName}
        demoContent={props.demoContent}
    />
    <ConnectionState
        con={props.con}
        ice={props.ice}
    />
</div>

const Chat = props => {

    const [messages, setMessages] = useState([])

    const [conState, setConState] = useState(connection.rtc.connectionState)
    const [iceState, setIceState] = useState(connection.rtc.iceConnectionState)

    const [hue, setHue] = useState(20)
    const [name, setName] = useState("test")

    connection.rtc.onconnectionstatechange = () => setConState(connection.rtc.connectionState)
    connection.rtc.oniceconnectionstatechange = () => setIceState(connection.rtc.iceConnectionState)

    const sendMessage = content => {
        const message = new MessageData(hue, name, content)
        setMessages([...messages, message])
        connection.channel.send(JSON.stringify(message))
    }

    connection.onMessageCallback = data => setMessages([...messages, JSON.parse(data)])

    return <div className="Chat">
        <ChatHeader
            con={conState}
            ice={iceState}

            hue={hue} setHue={setHue}
            name={name} setName={setName}

            demoContent={"my message is long, but you shall hear it"}
        />
        <Messages
            messages={messages}
        />
        <ComposeMessage
            send={sendMessage}
            conState={conState}
        />
    </div>
}

function App() {
    return (
        <div className="App">
            <ConnectionHandler />
            <Chat />
        </div>
    )
}

export default App;
