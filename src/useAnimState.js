import { useState } from "react"

const useAnimState = value => {
    const [oldValue, setOldValue] = useState(value)
    const [anim, setAnim] = useState(0)
    if (value !== oldValue) {
        setAnim(1)
        setOldValue(value)
    }
    return [anim, () => setAnim(0)]
}

export default useAnimState