import Spinner from '@components/Spinner'
import { ItemNavigationData } from '@models/ComicData'

import { PickEnum } from '~/tsUtils'

import NavElement, { NavElementMode } from './NavElement'

export default function ItemNavigation({
    itemNavigationData,
    isLoading,
    useColors,
    onSetCurrentComic,
    onShowInfoFor,
    mode,
    editMode,
    onRemoveItem,
    onAddItem,
}: {
    itemNavigationData: ItemNavigationData[]
    isLoading: boolean
    useColors: boolean
    onSetCurrentComic: (comicNo: number) => void
    onShowInfoFor: (item: ItemNavigationData) => void
    mode: PickEnum<
        NavElementMode,
        NavElementMode.Present | NavElementMode.Missing
    >
    editMode?: boolean
    onRemoveItem?: (_: ItemNavigationData) => void
    onAddItem?: (_: ItemNavigationData) => void
}) {
    let itemNavElements: {
        cast: React.ReactNode[]
        location: React.ReactNode[]
        storyline: React.ReactNode[]
    } = {
        cast: [],
        location: [],
        storyline: [],
    }
    for (const item of itemNavigationData) {
        itemNavElements[item.type].push(
            <NavElement
                key={item.id}
                item={item}
                onSetCurrentComic={onSetCurrentComic}
                useColors={useColors}
                onShowInfoFor={onShowInfoFor}
                mode={mode}
                editMode={editMode}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
            />
        )
    }

    if (isLoading) {
        return (
            <div className="text-center pt-4">
                <Spinner
                    loadingText="Loading..."
                    height="h-8"
                    width="w-8"
                    textColor="text-black"
                    spinnerBgColor="text-gray-300"
                    spinnerColor="fill-qc-link"
                />
            </div>
        )
    }

    if (!itemNavigationData.length) {
        return <></>
    }

    return (
        <div className="text-center">
            {itemNavElements.cast.length ? (
                <>
                    <h1 className="text-base font-normal text-center m-2">
                        Cast Members
                    </h1>
                    {mode === NavElementMode.Missing ? (
                        <h2 className="text-xs font-normal text-center">
                            (Non-Present)
                        </h2>
                    ) : (
                        <></>
                    )}
                    {itemNavElements.cast}
                </>
            ) : (
                <></>
            )}
            {itemNavElements.location.length ? (
                <>
                    <h1 className="text-base font-normal text-center m-2">
                        Locations
                    </h1>
                    {mode === NavElementMode.Missing ? (
                        <h2 className="text-xs font-normal text-center">
                            (Non-Present)
                        </h2>
                    ) : (
                        <></>
                    )}
                    {itemNavElements.location}
                </>
            ) : (
                <></>
            )}
            {itemNavElements.storyline.length ? (
                <>
                    <h1 className="text-base font-normal text-center m-2">
                        Storylines
                    </h1>
                    {mode === NavElementMode.Missing ? (
                        <h2 className="text-xs font-normal text-center">
                            (Non-Present)
                        </h2>
                    ) : (
                        <></>
                    )}
                    {itemNavElements.storyline}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
