import { useEffect, useMemo, useState } from 'react'

import styles from './ModalPageOverlay.module.css'

import { BODY_CONTAINER_ID } from '~/shared'
import { debug } from '~/utils'

export default function ModalPageOverlay({
    show,
    onClick,
}: {
    show: boolean
    onClick?: () => void
}) {
    let originalBodyOverflow = useMemo(() => document.body.style.overflow, [])

    const [fadedIn, setFadedIn] = useState(false)

    useEffect(() => {
        const body = document.getElementById(BODY_CONTAINER_ID)!

        if (show) {
            debug('Hiding body overflow')
            // When a modal is active, remove the scrolling from the main body
            document.body.style.overflow = 'hidden'
            body.setAttribute('aria-hidden', 'true')
        } else {
            debug('Restoring body overflow')
            // Return the scrolling to normal on the main body when the modal
            // is closed once again.
            document.body.style.overflow = originalBodyOverflow
            body.setAttribute('aria-hidden', '')
        }
    }, [show, originalBodyOverflow])
    return (
        <div
            className={
                `fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto ` +
                styles.modalPageOverlay +
                (show ? ' ' + styles.show : ' pointer-events-none') +
                (fadedIn ? ' ' + styles.fadedIn : '')
            }
            style={{ zIndex: 1000 }}
            tabIndex={-1}
            aria-hidden={!show}
            onClick={() => {
                if (onClick) {
                    debug('Page overlay on-click')
                    onClick()
                }
            }}
            onAnimationStart={(e) => {
                if (e.animationName === styles['fade-in']) {
                    // We set this here to ensure that when fade out starts,
                    // the element doesn't instantly disappear, as the
                    // `styles.fadedIn` style keeps it alive.
                    setFadedIn(true)
                }
            }}
            onAnimationEnd={(e) => {
                if (e.animationName === styles['fade-out']) {
                    // Once fade-out is done, we can remove the special
                    // keep-alive style we added at the start of fade-in
                    // to actually let the element disappear fully,
                    setFadedIn(false)
                }
            }}
        ></div>
    )
}