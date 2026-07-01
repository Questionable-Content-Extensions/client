export default function Popup({
    show,
    onClose,
    children,
    position,
    preventClose,
}: {
    show: boolean
    onClose: () => void
    children: React.ReactNode
    position?: [number, number]
    preventClose?: boolean
}) {
    return (
        show && (
            <span
                className="absolute z-[2] pt-2"
                style={{
                    left: position && position[0],
                    top: position && position[1],
                }}
            >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <span
                    className="fixed inset-0"
                    onClick={(e) => {
                        e.preventDefault()
                        if (!preventClose) {
                            onClose()
                        }
                    }}
                ></span>
                {children}
            </span>
        )
    )
}
