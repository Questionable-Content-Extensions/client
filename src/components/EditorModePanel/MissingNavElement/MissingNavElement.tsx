import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import { ComicId } from '@models/ComicId'
import { NavigationData } from '@models/NavigationData'

// TODO: Set up stories for `MissingNavElement`
export default function MissingNavElement({
    navigationData,
    currentComic,
    id,
    title,
    description,
    onSetCurrentComic,
    useColors,
}: {
    navigationData: NavigationData | null
    currentComic: ComicId
    id: number
    title: string
    description: string
    onSetCurrentComic: (comic: number) => void
    useColors: boolean
}) {
    if (navigationData) {
        if (
            navigationData.first ||
            navigationData.previous ||
            navigationData.next ||
            navigationData.last
        ) {
            return (
                <NavElement
                    item={{
                        ...navigationData,
                        color: '5f0000',
                        id,
                        name: description,
                        shortName: title,
                        type: 'cast',
                        count: 0,
                    }}
                    currentComic={currentComic}
                    onSetCurrentComic={onSetCurrentComic}
                    useColors={useColors}
                    onShowInfoFor={() => {}}
                    mode={NavElementMode.Editor}
                />
            )
        }
    }
    return <></>
}
