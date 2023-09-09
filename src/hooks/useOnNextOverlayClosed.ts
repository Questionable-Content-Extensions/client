import { useContext, useEffect, useState } from 'react'

import { OverlayContext } from '@modals/ModalPageOverlay/ModalPageOverlay'

export default function useOnNextOverlayClosed(action: () => void) {
    const [overlayActive, _] = useContext(OverlayContext)
    const [takeActionNextOverlayClosed, setTakeActionNextOverlayClosed] =
        useState(false)

    useEffect(() => {
        if (!overlayActive && takeActionNextOverlayClosed) {
            action()
            setTakeActionNextOverlayClosed(false)
        }
    }, [overlayActive, takeActionNextOverlayClosed, action])

    return setTakeActionNextOverlayClosed
}
