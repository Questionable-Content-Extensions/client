import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export default function ModalPortal({
    children,
}: {
    children: React.ReactChild
}) {
    const mount = document.getElementById('qc-ext-portal-container')
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
