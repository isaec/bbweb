//lots of code from https://mac-blog.org.ua/webrtc-one-to-one-without-signaling-server/

export default class Connection {
    constructor() {
        this.channel = null

        this.rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })

        this.rtc.ondatachannel = event => {
            console.log("ondatachannel")
            this.channel = event.channel
            this.channel.onopen = console.log
            this.channel.onmessage = console.log
        }
    }
    async createOffer() {
        this.channel = this.rtc.createDataChannel("data")
        let localDescription = new Promise((resolve, reject) => {
            this.rtc.onicecandidate = event => {
                if (!event.candidate) {
                    resolve(JSON.stringify(this.rtc.localDescription))
                }
            }
        })

        const offer = await this.rtc.createOffer()
        await this.rtc.setLocalDescription(offer)
        await localDescription
        return localDescription
    }

    async createAnswer() {
        this.rtc.onicecandidate = event => {
            if (!event.candidate) console.log(JSON.stringify(this.rtc.localDescription))
        }

        const answer = await this.rtc.createAnswer()
        await this.rtc.setLocalDescription(answer)
    }

    async acceptOffer(offer) {
        const offerObj = JSON.parse(offer)
        await this.rtc.setRemoteDescription(offerObj.value)
    }

    async acceptAnswer(answer) {
        const answerObj = JSON.parse(answer)
        await this.rtc.setRemoteDescription(answerObj.value)
    }

}