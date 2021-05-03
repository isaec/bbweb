import { nanoid } from "nanoid"

export default class MessageData {
    constructor(hue, name, content, id) {
        this.id = id || nanoid()
        this.hue = hue
        this.name = name
        this.content = content
    }
}