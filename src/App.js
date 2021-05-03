import React from 'react';
import './App.css';
import Connection from './connection';

import MessageData from "./MessageData"

const connection = new Connection()


const Create = props => <div className="Create">
    <code className="copy">{props.result}</code>
    <button
        onClick={async () => await props.fn()}
        disabled={props.result !== null}
    >create {props.thing}
    </button>
</div>


class Accept extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({ value: event.target.value })
    }
    render() {
        return <div className="Accept">
            <textarea
                className="paste"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"

                onChange={this.handleChange}
                value={this.state.value}
                placeholder={`paste the ${this.props.thing} here to accept it`}
            ></textarea>
            <button
                onClick={async () => await this.props.fn(this.state.value)}
                disabled={this.state.value.length < 1 || this.props.result !== null}
            >accept {this.props.thing}
            </button>
        </div>
    }
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

class ComposeMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "",
            lines: 1
        }
        this.handleChange = this.handleChange.bind(this)
        this.keyDown = this.keyDown.bind(this)
        this.canSend = this.canSend.bind(this)
        this.send = this.send.bind(this)
    }
    handleChange(event) {
        this.setState({
            value: event.target.value,
            lines: Math.min(event.target.value.split(/\n/).length, 10)
        })
    }
    keyDown(e) {
        if (e.key === "Enter" && !e.shiftKey && this.canSend()) {
            this.send()
            e.preventDefault()
        }
    }
    canSend() { return /\p{L}/u.test(this.state.value) && connection.rtc.connectionState === "connected" }
    send() {
        this.setState({
            value: "",
            lines: 1
        })
        this.props.send(this.state.value)
    }
    render() {
        return <div className="ComposeMessage">
            <textarea
                className="messageBox"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="on"
                spellCheck="true"

                onChange={this.handleChange}
                onKeyDown={this.keyDown}
                value={this.state.value}
                placeholder="type a message to the group"
                rows={this.state.lines}
            ></textarea>
            <button
                onClick={this.send}
                disabled={!this.canSend()}
            >send</button>
        </div>
    }
}


class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        connection.onMessageCallback = this.onMessage.bind(this)
    }
    sendMessage(content) {
        const message = new MessageData(1, 50, "test", content)
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
            <Messages messages={this.state.messages} />
            <ComposeMessage send={this.sendMessage} />
        </div>
    }
}

class ConnectionState extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            con: connection.rtc.connectionState,
            ice: connection.rtc.iceConnectionState
        }
        connection.rtc.onconnectionstatechange = () => this.setState({ con: connection.rtc.connectionState })
        connection.rtc.oniceconnectionstatechange = () => this.setState({ ice: connection.rtc.iceConnectionState })
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
            <ConnectionHandler />
            <Chat />
        </div>
    )
}

export default App;
