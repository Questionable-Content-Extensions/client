import { useEffect, useState } from 'react'
import { createTintOrShade } from '../color'
import constants from '../constants'
import useComic from '../hooks/useComic'
import useComicData from '../hooks/useComicData'
import useSettings from '../hooks/useSettings'
import { ComicData, ItemNavigationData } from '../services/comicDataService'
import { debug } from '../utils'
import Spinner from './Spinner'

export default function ExtraNavigation() {
    const {
        setFirstComic,
        previousComic: [previousComic, setPreviousComic],
        currentComic: [currentComic, setCurrentComic],
        nextComic: [nextComic, setNextComic],
        latestComic: [latestComic, setLatestComic],
        randomComic: [randomComic, setRandomComic],
    } = useComic()
    const {
        comicDataLoading: [comicDataLoading, _comicDataComicLoading],
        comicData,
        refreshComicData,
    } = useComicData()

    const [comicSelectorNo, setComicSelectorNo] = useState<string | null>(null)
    useEffect(() => {
        if (comicData) {
            setComicSelectorNo(comicData.comic.toString())
        }
    }, [comicData])

    return (
        <div className="bg-stone-100 border-solid shadow-md border-0 border-b border-qc-header xl:fixed xl:top-48 xl:right-[50%] xl:-mr-[620px] xl:w-64 xl:border xl:border-stone-300 z-10 p-2">
            <div className="-mx-2 -mt-2 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                Questionable Content Extensions
            </div>
            <div className="flex shadow -mx-2">
                <ExtraNavButton
                    comicNo={1}
                    title="First strip"
                    visible={(currentComic || 0) !== 1}
                    faClass="fast-backward"
                    onClick={() => setFirstComic()}
                    extraClass="!border-l-0"
                />
                <ExtraNavButton
                    comicNo={previousComic}
                    title="Previous strip"
                    visible={(currentComic || 0) !== 1}
                    faClass="backward"
                    onClick={() => setPreviousComic()}
                />
                <span
                    className="inline-block text-center flex-auto font-bold text-xs border-solid border-0 border-b border-l border-stone-300"
                    title={`Comic ${(currentComic ?? '').toString()}`}
                >
                    {currentComic ? `#${currentComic}` : ''}
                </span>
                <ExtraNavButton
                    comicNo={nextComic}
                    title="Next strip"
                    visible={(currentComic || 0) !== latestComic}
                    faClass="forward"
                    onClick={() => setNextComic()}
                />
                <ExtraNavButton
                    comicNo={latestComic}
                    title="Last strip"
                    visible={(currentComic || 0) !== latestComic}
                    faClass="fast-forward"
                    onClick={() => setLatestComic()}
                />
                <ExtraNavButton
                    comicNo={randomComic}
                    title="Random strip"
                    visible={true}
                    faClass="question"
                    onClick={() => setRandomComic()}
                    extraClass="px-0.5"
                    noXPadding
                />
            </div>
            {comicDataLoading ? (
                <div className="text-center pt-4">
                    <Spinner
                        loadingText="Loading..."
                        height="h-8"
                        width="w-8"
                        textColor="text-black"
                        spinnerBgColor="text-gray-400"
                        spinnerColor="fill-qc-link"
                    />
                </div>
            ) : comicData && comicData.hasData && comicData.items.length ? (
                <>
                    <ItemNavigation
                        itemNavigationData={comicData.items}
                        setCurrentComic={setCurrentComic}
                    />
                </>
            ) : (
                <div className="text-center pt-4">
                    <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                    ></i>
                    <br />
                    Comic has no data
                </div>
            )}
            <hr className="my-4 mx-0 border-solid border-b max-w-none" />
            <div className="grid grid-rows-2 space-y-1">
                <div className="grid grid-cols-2 space-x-1">
                    <button
                        className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 rounded-sm disabled:opacity-75"
                        onClick={() => refreshComicData()}
                        disabled={comicDataLoading}
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 rounded-sm"
                        onClick={() => debug('TODO: Show settings dialog')}
                    >
                        Settings
                    </button>
                </div>
                <div className="flex">
                    <label
                        title="Comic #"
                        htmlFor="qc-ext-extra-navigation-comic"
                        className={
                            `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                            (comicDataLoading ? ' opacity-75' : '')
                        }
                    >
                        #
                    </label>
                    <input
                        id="qc-ext-extra-navigation-comic"
                        type="number"
                        placeholder="Comic #"
                        min={1}
                        max={latestComic ?? 1}
                        value={comicSelectorNo ?? ''}
                        onChange={(e) => setComicSelectorNo(e.target.value)}
                        className="border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75"
                        disabled={comicDataLoading}
                    />
                    <button
                        className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-2 px-4 rounded-l-none rounded-r-sm disabled:opacity-75"
                        onClick={() => {
                            if (
                                comicSelectorNo &&
                                /^\d+$/.test(comicSelectorNo)
                            ) {
                                const comicNo = Number(comicSelectorNo)
                                if (
                                    comicNo >= 1 &&
                                    comicNo <= (latestComic as number)
                                ) {
                                    setCurrentComic(comicNo)
                                }
                            }
                        }}
                        disabled={comicDataLoading}
                    >
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

function ExtraNavButton({
    comicNo,
    title,
    visible,
    onClick,
    faClass,
    extraClass,
    noXPadding,
}: {
    comicNo: number | null
    title: string
    visible: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    faClass: string
    extraClass?: string
    noXPadding?: boolean
}) {
    const textColor =
        'text-black hover:text-gray-500 focus:text-black visited:text-black'
    const border = 'border-solid border-0 border-b border-l border-stone-300'
    const size = 'px-4'
    return (
        <a
            href={`view.php?comic=${comicNo}`}
            title={title}
            className={
                `flex-none ${
                    noXPadding ? '' : size
                } py-0.5 block text-xs ${textColor}  ${border} ${
                    extraClass ?? ''
                }` + (!visible ? ' pointer-events-none' : '')
            }
            onClick={(e) => {
                e.preventDefault()
                if (onClick && visible) {
                    onClick(e)
                }
            }}
            tabIndex={!visible ? -1 : undefined}
        >
            <i
                className={`fa fa-${faClass}` + (!visible ? ' invisible' : '')}
            ></i>
        </a>
    )
}

function ItemNavigation({
    itemNavigationData,
    setCurrentComic,
}: {
    itemNavigationData: ItemNavigationData[]
    setCurrentComic: (comicNo: number) => void
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
                setCurrentComic={setCurrentComic}
            />
        )
    }
    return (
        <>
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
        </>
    )
}

function NavElement({
    item,
    setCurrentComic,
}: {
    item: ItemNavigationData
    setCurrentComic: (comicNo: number) => void
}) {
    let [settings, _updateSettings] = useSettings()

    let backgroundcolor = item.color
    if (!backgroundcolor.startsWith('#')) {
        backgroundcolor = `#${backgroundcolor}`
    }
    const foregroundColor = createTintOrShade(item.color)
    const hoverFocusColor = createTintOrShade(item.color, 2)

    // TODO: Handle the case when colors are not desired
    let _useColors = settings.values.useColors

    return (
        <>
            <style>
                {`
                    #qc-ext-navelement-${item.id} {
                        background-color: ${backgroundcolor};
                    }
                    #qc-ext-navelement-${item.id} a,
                    #qc-ext-navelement-${item.id} button {
                        transition-duration: 0.4s;
                        color: ${foregroundColor};
                    }

                    #qc-ext-navelement-${item.id} a:hover,
                    #qc-ext-navelement-${item.id} a:focus,
                    #qc-ext-navelement-${item.id} button:hover,
                    #qc-ext-navelement-${item.id} button:focus {
                        color: ${hoverFocusColor};
                    }
                `}
            </style>
            <div
                id={`qc-ext-navelement-${item.id}`}
                className="flex items-center rounded"
            >
                <NavButton
                    comicNo={item.first}
                    title={`First strip with ${item.shortName}`}
                    faClass="fast-backward"
                    setCurrentComic={setCurrentComic}
                />
                <NavButton
                    comicNo={item.previous}
                    title={`Previous strip with ${item.shortName}`}
                    faClass="backward"
                    setCurrentComic={setCurrentComic}
                />
                <button
                    className="flex-auto py-1 font-bold"
                    onClick={() =>
                        debug(
                            `TODO: show info about ${item.shortName} (${item.id})`
                        )
                    }
                >
                    <span
                        className="inline-block text-center"
                        title={item.name}
                        // style={{ maxWidth: '120px' }}
                    >
                        {item.shortName}
                    </span>
                </button>
                <NavButton
                    comicNo={item.next}
                    title={`Next strip with ${item.shortName}`}
                    faClass="forward"
                    setCurrentComic={setCurrentComic}
                />
                <NavButton
                    comicNo={item.last}
                    title={`Last strip with ${item.shortName}`}
                    faClass="fast-forward"
                    setCurrentComic={setCurrentComic}
                />
            </div>
        </>
    )
}

function NavButton({
    comicNo,
    title,
    faClass,
    setCurrentComic,
}: {
    comicNo: number | null
    title: string
    faClass: string
    setCurrentComic: (comicNo: number) => void
}) {
    let comicLink = comicNo ? `view.php?comic=${comicNo}` : '#'
    return (
        <a
            href={comicLink}
            title={title}
            className={'flex-none px-2 block' + (!comicNo ? ' invisible' : '')}
            onClick={(e) => {
                e.preventDefault()
                setCurrentComic(comicNo as number)
            }}
        >
            <i className={`fa fa-${faClass}`}></i>
        </a>
    )
}
