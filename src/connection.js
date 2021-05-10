//lots of code from https://mac-blog.org.ua/webrtc-one-to-one-without-signaling-server/

export default class Connection {
    constructor() {
        this.channel = null

        this.rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

        this.rtc.ondatachannel = event => this.setChannel(event.channel)

        this.onMessageCallback = undefined
        this.onMessage = this.onMessage.bind(this)
    }
    static ops = Object.freeze({
        createOffer: "createOffer",
        createAnswer: "createAnswer",
        acceptOffer: "acceptOffer",
        acceptAnswer: "acceptAnswer"
    })
    onMessage(e) {
        if (this.onMessageCallback) this.onMessageCallback(e.data)
    }
    setChannel(channel) {
        this.channel = channel
        channel.onmessage = this.onMessage
    }
    async _localDescription() {
        return new Promise((resolve, reject) => {
            this.rtc.onicecandidate = event => {
                if (!event.candidate) resolve(JSON.stringify(this.rtc.localDescription))
            }
        })
    }
    async createOffer() {
        this.setChannel(this.rtc.createDataChannel("data"))
        let localDescription = this._localDescription()

        const offer = await this.rtc.createOffer()
        await this.rtc.setLocalDescription(offer)
        await localDescription
        return localDescription
    }

    async createAnswer() {
        let localDescription = this._localDescription()

        const answer = await this.rtc.createAnswer()
        await this.rtc.setLocalDescription(answer)
        await localDescription
        return localDescription
    }

    async acceptRemote(remote) {
        const remoteObj = JSON.parse(remote)
        await this.rtc.setRemoteDescription(remoteObj)
    }
    validate(str, type) {
        let json
        try { json = JSON.parse(str) }
        catch (e) { return false }
        return Object.keys(json).length === 2 && json.type === type && json.sdp !== undefined
    }
}