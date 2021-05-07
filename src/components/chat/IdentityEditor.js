import React, { useState } from 'react';
import "../../common.css"
import "./IdentityEditor.css"

import { Message } from "./Chat"

const IdentityEditor = props => {

    const [temp, setTemp] = useState(props.name)


    return <div
        className="IdentityEditor"
    >
        <Message
            hue={props.hue}
            name={props.name}
            content={props.demoContent}
        />
        <div className="inputBlock">
            <div className="inputWrapper">
                <label
                    htmlFor="nameText"
                >name</label>
                <input
                    type="text"
                    name="name" id="nameText"
                    value={temp}
                    className="name"

                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="tom riddle"

                    maxLength="16" size="16"

                    onChange={e => {
                        setTemp(e.target.value)
                        props.setName(e.target.value.length > 0 ? e.target.value : "tom riddle")
                    }}
                />
            </div>
            <div className="inputWrapper grow">
                <label
                    htmlFor="hueRange"
                >hue</label>
                <input
                    type="range"
                    name="hue" id="hueRange"
                    min="0"
                    max="360"
                    value={props.hue}
                    className="hue"

                    onChange={e => props.setHue(e.target.value)}
                />
            </div>
        </div>
    </div>
}

export default IdentityEditor