import React from 'react';
import "../../common.css"
import "./IdentityEditor.css"

import { Message } from "./Chat"

const IdentityEditor = props => <div
    className="IdentityEditor"
>
    <Message
        hue={props.hue}
        name={props.name}
        content={props.demoContent}
    />
    <div className="inputWrapper">
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

export default IdentityEditor