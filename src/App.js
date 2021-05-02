import React from 'react';
import './App.css';
import Connection from './connection';


const connection = new Connection()


// class Create extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             result: null
//         }
//     }
//     async click() {
//         const result = await this.props.fn()
//         this.setState({ result: result })
//     }
//     render() {
//         return <div className="Create">
//             <code className="copy">{this.state.result}</code>
//             <button
//                 onClick={async () => await this.click()}
//                 disabled={this.state.result !== null}
//             >create {this.props.thing}</button>

//         </div>
//     }
// }



const Create = props => <div className="Create">
    <code className="copy">{props.result}</code>
    <button
        onClick={async () => await props.fn()}
        disabled={props.result !== null}
    >create {props.thing}</button>
</div>



class ConnectionHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offer: null,
            answer: null
        }
    }

    async do(thing, data) {
        console.log(thing)
    }

    render() {
        return <div className="ConnectionHandler">
            <Create
                thing="offer"
                result={this.state.offer}
                fn={this.do.bind(this, connection.ops.createOffer)}
            />
            <Create
                thing="answer"
                result={this.state.offer}
                fn={this.do.bind(this, connection.ops.createAnswer)}
            />
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
