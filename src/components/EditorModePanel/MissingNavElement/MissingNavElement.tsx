import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import { NavigationData } from '@models/NavigationData'

// TODO: Set up stories for `MissingNavElement`
export default function MissingNavElement({
    navigationData,
    id,
    title,
    description,
    onSetCurrentComic,
    useColors,
}: {
    navigationData: NavigationData | null
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
