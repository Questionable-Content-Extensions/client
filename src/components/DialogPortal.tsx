import { ReactChild } from 'react'

import ModalPortal from '@components/Modals/ModalPortal/ModalPortal'
import ModalDialogSeat from '@modals/ModalDialogSeat/ModalDialogSeat'
import ModalPageOverlay from '@modals/ModalPageOverlay/ModalPageOverlay'

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
    return (
        <ModalPortal>
            <>
                <ModalPageOverlay show={show} />
                <ModalDialogSeat show={show} onClick={() => onClose()}>
                    {children}
                </ModalDialogSeat>
            </>
        </ModalPortal>
    )
}
