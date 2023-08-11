import { debug } from '../../utils'

export default function ModalDialogSeat({
    show,
    onClick,
    children,
}: {
    show: boolean
    onClick?: () => void
    children: React.ReactChild
}) {
    return (
        <div
            data-dialog-seat="true"
            className={
                'fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto grid place-items-center' +
                (show ? ' block' : ' hidden')
            }
            style={{ zIndex: 2000 }}
            onClick={function (this: any, event) {
                if (onClick) {
                    let target = event.target as HTMLElement
                    if (target.dataset['dialogSeat']) {
                        debug('Dialog seat on-click')
                        onClick()
                    }
                }
            }}
        >
            {children}
        </div>
    )
}
