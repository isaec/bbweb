import React from 'react';
import './App.css';
import Connection from './connection';


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

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [
                { id: 1, hue: 50, name: "bob", content: "my message is long, but you shall hear it" },
                { id: 2, hue: 50, name: "bob", content: "even if you do not like it" },
                { id: 3, hue: 170, name: "mark", content: "really?" },
                { id: 4, hue: 0, name: "brad", content: "he lies!" },
                { id: 5, hue: 90, name: "jon", content: "it is true" }
            ]
        }
    }
    render() {
        return <div
            className="Chat"
        >
            <button
                onClick={
                    () => {
                        const messages = this.state.messages.slice()
                        messages.push({ id: 5, hue: 30, name: "test", content: "testing" })
                        this.setState(
                            {
                                messages: messages
                            }
                        )
                    }
                }
            >ye</button>
            <Messages messages={this.state.messages} />
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
