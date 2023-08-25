import NavElement, { NavElementMode } from '@components/NavElement/NavElement'
import Spinner from '@components/Spinner'
import { ItemNavigationData } from '@models/ItemNavigationData'

import { PickEnum } from '~/tsUtils'

export default function ItemNavigation({
    itemNavigationData,
    isLoading,
    isFetching,
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
    isFetching: boolean
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
                        <span className="invisible">
                            <SpinningLoader />
                        </span>
                        Cast Members
                        <span
                            className={
                                'inline-block align-middle' +
                                (!isFetching ? ' invisible' : '')
                            }
                        >
                            <SpinningLoader />
                        </span>
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
                        <span className="invisible">
                            <SpinningLoader />
                        </span>
                        Locations
                        <span
                            className={
                                'inline-block align-middle' +
                                (!isFetching ? ' invisible' : '')
                            }
                        >
                            <SpinningLoader />
                        </span>
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
                        <span className="invisible">
                            <SpinningLoader />
                        </span>
                        Storylines
                        <span
                            className={
                                'inline-block align-middle' +
                                (!isFetching ? ' invisible' : '')
                            }
                        >
                            <SpinningLoader />
                        </span>
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

function SpinningLoader() {
    return (
        <svg
            className="animate-spin ml-1 mr-3 h-5 w-5 text-qc-header"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    )
}
