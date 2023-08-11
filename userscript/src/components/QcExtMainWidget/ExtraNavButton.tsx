export default function ExtraNavButton({
    comicNo,
    title,
    visible,
    faClass,
    smallXPadding,
    noLeftBorder,
    onClick,
}: {
    comicNo: number | null
    title: string
    visible: boolean
    faClass: string
    smallXPadding?: boolean
    noLeftBorder?: boolean
    onClick?: () => void
}) {
    const textColor =
        'text-black hover:text-gray-500 focus:text-black visited:text-black'
    const border =
        'border-solid border-0 border-stone-300' +
        (noLeftBorder ? '' : ' border-l')
    const size = smallXPadding ? 'px-0.5' : 'px-4'
    return (
        <a
            href={`view.php?comic=${comicNo}`}
            title={`Go to ${title.toLowerCase()}`}
            className={
                `flex-none ${size} py-0.5 block text-xs ${textColor}  ${border} ` +
                (!visible ? ' pointer-events-none' : '')
            }
            onClick={(e) => {
                e.preventDefault()
                if (onClick && visible) {
                    onClick()
                }
            }}
            tabIndex={!visible ? -1 : undefined}
        >
            <span className="sr-only">Go to {title.toLowerCase()}</span>
            <i
                className={`fa fa-${faClass}` + (!visible ? ' invisible' : '')}
                aria-hidden
            ></i>
        </a>
    )
}
