import React, { useState, useMemo, useRef } from 'react';
import "../../common.css"
import "./Chat.css"
import IdentityEditor from "./IdentityEditor"

import MessageData from "../../MessageData"

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

const Messages = React.forwardRef((props, ref) => {
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
        <div ref={ref} />
    </div>
})

const ComposeMessage = props => {
    const [value, setValue] = useState("")

    const rows = useMemo(() => Math.min(value.split(/\n/).length, 10), [value])
    const hasContent = useMemo(() => /\S/u.test(value), [value])

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

    const [conState, setConState] = useState(props.conn.rtc.connectionState)
    const [iceState, setIceState] = useState(props.conn.rtc.iceConnectionState)

    const [hue, setHue] = useState(Math.floor(Math.random() * 359))
    const [name, setName] = useState(`user${(Math.floor(Math.random() * 999)).toString().padStart(3, "0")}`)

    const messagesBottom = useRef()

    props.conn.rtc.onconnectionstatechange = () => setConState(props.conn.rtc.connectionState)
    props.conn.rtc.oniceconnectionstatechange = () => setIceState(props.conn.rtc.iceConnectionState)

    const scrollToBottom = () => requestAnimationFrame(() => messagesBottom.current.scrollIntoView({ behavior: "smooth" }))

    const sendMessage = content => {
        const message = new MessageData(hue, name, content)
        setMessages([...messages, message])
        props.conn.channel.send(JSON.stringify(message))
        scrollToBottom()
    }

    props.conn.onMessageCallback = data => {
        setMessages([...messages, JSON.parse(data)])
        scrollToBottom()
    }

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
            ref={messagesBottom}
        />
        <ComposeMessage
            send={sendMessage}
            conState={conState}
        />
    </div>
}

export { Chat, Message }