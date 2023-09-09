import { ReactChild, useState } from 'react'

import ModalPortal from '@components/Modals/ModalPortal/ModalPortal'
import ModalDialogSeat from '@modals/ModalDialogSeat/ModalDialogSeat'
import ModalPageOverlay, {
    OverlayContext,
} from '@modals/ModalPageOverlay/ModalPageOverlay'

type DialogPortalProps = {
    show: boolean
    children: ReactChild
    onClose: () => void
}

export default function DialogPortal({
    show,
    children,
    onClose,
}: DialogPortalProps) {
    const [active, setActive] = useState(false)
    return (
        <ModalPortal>
            <OverlayContext.Provider value={[active, setActive]}>
                <ModalPageOverlay show={show} />
                <ModalDialogSeat show={show} onClick={() => onClose()}>
                    {children}
                </ModalDialogSeat>
            </OverlayContext.Provider>
        </ModalPortal>
    )
}
