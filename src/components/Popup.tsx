export default function Popup({
    show,
    onClose,
    children,
    position,
}: {
    show: boolean
    onClose: () => void
    children: React.ReactNode
    position?: [number, number]
}) {
    return show ? (
        <span
            className="absolute z-[2] pt-2"
            style={{
                left: position && position[0],
                top: position && position[1],
            }}
        >
            <span
                className="fixed inset-0"
                onClick={(e) => {
                    e.preventDefault()
                    onClose()
                }}
            ></span>
            {children}
        </span>
    ) : (
        <></>
    )
}
