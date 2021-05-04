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

class ConnectionHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            localOffer: null,
            localAnswer: null,
            remoteOffer: null,
            remoteAnswer: null
        }
    }

    async do(thing, data) {
        switch (thing) {
            case Connection.ops.createOffer:
                const offer = await connection.createOffer()
                this.setState({ localOffer: offer })
                break
            case Connection.ops.createAnswer:
                const answer = await connection.createAnswer()
                this.setState({ localAnswer: answer })
                break
            case Connection.ops.acceptOffer:
                connection.acceptRemote(data)
                this.setState({ remoteOffer: data })
                break
            case Connection.ops.acceptAnswer:
                connection.acceptRemote(data)
                this.setState({ remoteAnswer: data })
                break
            default:
                console.log(thing, data)
        }
    }

    render() {
        return <div className="ConnectionHandler">
            {this.state.remoteOffer === null ?
                <Create
                    thing="offer"
                    result={this.state.localOffer}
                    fn={this.do.bind(this, Connection.ops.createOffer)}
                />
                :
                <Create
                    thing="answer"
                    result={this.state.localAnswer}
                    fn={this.do.bind(this, Connection.ops.createAnswer)}
                />
            }
            {this.state.localOffer === null ?
                <Accept
                    thing="offer"
                    result={this.state.remoteOffer}
                    fn={this.do.bind(this, Connection.ops.acceptOffer)}
                />
                :
                <Accept
                    thing="answer"
                    result={this.state.remoteAnswer}
                    fn={this.do.bind(this, Connection.ops.acceptAnswer)}
                />
            }
        </div>
    }
}

const hsl = hue => `hsl(${hue},90%,70%)`

const Avatar = props =>
    <svg viewBox="0 0 100 100" className="Avatar">
        <circle cx="50" cy="50" r="50" fill={hsl(props.hue)} />
    </svg>

const Message = props =>
    <div className="Message">
        <Avatar hue={props.hue} />
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
    let [value, setValue] = useState("")

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
        <p>connection state: {props.con}</p>
        <p>ice state: {props.ice}</p>
    </div>


class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            conState: connection.rtc.connectionState,
            iceState: connection.rtc.iceConnectionState
        }

        connection.rtc.onconnectionstatechange = () => this.setState({ conState: connection.rtc.connectionState })
        connection.rtc.oniceconnectionstatechange = () => this.setState({ iceState: connection.rtc.iceConnectionState })


        this.sendMessage = this.sendMessage.bind(this)
        connection.onMessageCallback = this.onMessage.bind(this)
    }
    sendMessage(content) {
        const message = new MessageData(50, "test", content)
        this.setState({
            messages: [...this.state.messages, message]
        })
        connection.channel.send(JSON.stringify(message))
    }
    onMessage(data) {
        this.setState({
            messages: [...this.state.messages, JSON.parse(data)]
        })
    }
    render() {
        return <div className="Chat">
            <ConnectionState
                con={this.state.conState}
                ice={this.state.iceState}
            />
            <Messages
                messages={this.state.messages}
            />
            <ComposeMessage
                send={this.sendMessage}
                conState={this.state.conState}
            />
        </div>
    }
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
