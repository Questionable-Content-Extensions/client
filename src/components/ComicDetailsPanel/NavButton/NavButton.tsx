import { ForkAwesomeIcon } from '@models/ForkAwesomeIcon'

export default function NavButton({
    comicNo,
    title,
    faClass,
    onSetCurrentComic,
}: {
    comicNo: number | null
    title: string
    faClass: ForkAwesomeIcon
    onSetCurrentComic: (comicNo: number) => void
}) {
    let comicLink = comicNo ? `view.php?comic=${comicNo}` : '#'
    return (
        <a
            href={comicLink}
            title={title}
            className={'flex-none px-2 block' + (!comicNo ? ' invisible' : '')}
            onClick={(e) => {
                e.preventDefault()
                onSetCurrentComic(comicNo as number)
            }}
        >
            <i className={`fa fa-${faClass}`}></i>
        </a>
    )
}
