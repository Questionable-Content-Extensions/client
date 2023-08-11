import { useMemo } from 'react'

import { ItemNavigationData } from '../../services/comicDataService'
import Spinner from '../Spinner'
import NavElement from './NavElement'

export default function ItemNavigation({
    itemNavigationData,
    isLoading,
    useColors,
    onSetCurrentComic,
    onShowInfoFor,
}: {
    itemNavigationData: ItemNavigationData[]
    isLoading: boolean
    useColors: boolean
    onSetCurrentComic: (comicNo: number) => void
    onShowInfoFor: (item: ItemNavigationData) => void
}) {
    let itemNavElements: {
        cast: React.ReactNode[]
        location: React.ReactNode[]
        storyline: React.ReactNode[]
    } = useMemo(() => {
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
                />
            )
        }
        return itemNavElements
    }, [itemNavigationData, useColors, onSetCurrentComic, onShowInfoFor])

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
        return (
            <div className="text-center pt-4">
                <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                ></i>
                <br />
                Comic has no data
            </div>
        )
    }

    return (
        <div className="text-center">
            {itemNavElements.cast.length ? (
                <>
                    <h1 className="text-base font-normal text-center m-2">
                        Cast Members
                    </h1>
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
                    {itemNavElements.storyline}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
