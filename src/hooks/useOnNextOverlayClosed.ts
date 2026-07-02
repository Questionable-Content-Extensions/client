import { useContext, useEffect, useRef } from 'react'

import { OverlayContext } from '@modals/ModalPageOverlay/ModalPageOverlay'

export default function useOnNextOverlayClosed(action: () => void) {
    const [overlayActive, _] = useContext(OverlayContext)
    const takeActionNextOverlayClosed = useRef(false)

    useEffect(() => {
        if (!overlayActive && takeActionNextOverlayClosed.current) {
            takeActionNextOverlayClosed.current = false
            action()
        }
    }, [overlayActive, action])

    return (value: boolean) => {
        takeActionNextOverlayClosed.current = value
    }
}
