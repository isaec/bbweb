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
                disabled={this.state.value.length < 1}
            >accept {this.props.thing}
            </button>
        </div>
    }
}

class ConnectionHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offer: null,
            answer: null
        }
    }

    async do(thing, data) {
        switch (thing) {
            case Connection.ops.createOffer:
                const offer = await connection.createOffer()
                this.setState({ offer: offer })
                break
            case Connection.ops.createAnswer:
                const answer = await connection.createAnswer()
                this.setState({ answer: answer })
                break
            default:
                console.log(thing, data)
        }
    }

    render() {
        return <div className="ConnectionHandler">
            <Create
                thing="offer"
                result={this.state.offer}
                fn={this.do.bind(this, Connection.ops.createOffer)}
            />
            <Accept
                thing="offer"
                fn={this.do.bind(this, Connection.ops.acceptOffer)}
            />
            {/* <Create
                thing="answer"
                result={this.state.answer}
                fn={this.do.bind(this, Connection.ops.createAnswer)}
            /> */}
        </div>
    }
}


const Avatar = () =>
    <svg viewBox="0 0 100 100" className="Avatar">
        <circle cx="50" cy="50" r="50" fill="pink" />
    </svg>

const Message = props =>
    <div className="message">
        {Avatar()}
        <div className="messageText">
            <p className="name">{props.name}</p>
            <p className="messageContent">{props.content}</p>
        </div>
    </div>

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
            <Message name="bob" content="my message is long, but you shall hear it" />
            <Message name="bob" content="even if you do not like it" />
            <Message name="mark" content="really?" />
        </div>
    )
}

export default App;
