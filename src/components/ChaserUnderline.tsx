import { ReactNode } from 'react'

export default function ChaserUnderline({
    active,
    color: className,
    children,
}: {
    active: boolean
    color?: string
    children: ReactNode
}) {
    if (!className) {
        className = 'bg-qc-link'
    }
    return (
        <span className="qc-ext-chaser-track relative inline-block pb-1">
            {children}
            {active && (
                <span
                    className={`qc-ext-chaser-bar absolute bottom-0 h-0.5 ${className}`}
                />
            )}
        </span>
    )
}
