import { useEffect, useState } from 'react'

import { debug } from '~/utils'

export default function ModalDialogSeat({
    show,
    onClick,
    children,
}: {
    show: boolean
    onClick?: () => void
    children: React.ReactChild
}) {
    const [hidden, setHidden] = useState(!show)
    useEffect(() => {
        if (show) {
            // Immediately show when `show` changes so that we can animate
            // in from the bottom...(contd. below)
            debug('Unhiding dialog seat')
            setHidden(false)
        }
    }, [show, setHidden])
    return (
        <div
            data-dialog-seat="true"
            className={
                'fixed left-0 w-full h-full ' +
                'outline-none overflow-hidden ' +
                'grid place-items-center ' +
                'transition-[top] duration-1000' +
                (show ? ' top-0' : ' top-[100vh] pointer-events-none') +
                (hidden ? ' invisible' : '')
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
            onTransitionEnd={(e) => {
                const target = e.target as HTMLElement
                if (
                    target.dataset['dialogSeat'] &&
                    !target.classList.contains('top-0')
                ) {
                    // (contd. from above) ...but don't hide again until
                    // we're completely back out of sight.
                    debug('Hiding dialog seat; was already hidden:', hidden)
                    setHidden(true)
                }
            }}
        >
            {children}
        </div>
    )
}
