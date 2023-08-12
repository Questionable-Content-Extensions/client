import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { PORTAL_CONTAINER_ID } from '~/index'

export default function ModalPortal({
    children,
}: {
    children: React.ReactChild
}) {
    const mount = document.getElementById(PORTAL_CONTAINER_ID)
    const el = useMemo(() => document.createElement('div'), [])

    useEffect(() => {
        if (mount) {
            mount.appendChild(el)
        }
        return () => {
            if (mount) {
                mount.removeChild(el)
            }
        }
    }, [el, mount])

    return createPortal(children, el)
}
