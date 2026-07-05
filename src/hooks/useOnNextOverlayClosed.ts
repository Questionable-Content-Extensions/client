import { useContext, useEffect, useLayoutEffect, useRef } from 'react'

import { OverlayContext } from '@modals/ModalPageOverlay/ModalPageOverlay'

export default function useOnNextOverlayClosed(action: () => void) {
    const [overlayActive, _] = useContext(OverlayContext)
    const takeActionNextOverlayClosed = useRef(false)
    const actionRef = useRef(action)

    useLayoutEffect(() => {
        actionRef.current = action
    })

    useEffect(() => {
        if (!overlayActive && takeActionNextOverlayClosed.current) {
            takeActionNextOverlayClosed.current = false
            actionRef.current()
        }
    }, [overlayActive])

    return (value: boolean) => {
        takeActionNextOverlayClosed.current = value
    }
}
