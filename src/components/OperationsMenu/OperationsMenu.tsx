import { useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { ComicId } from '@models/ComicId'
import {
    setShowCopyItemsDialog,
    setShowEditLogDialog,
} from '@store/dialogSlice'
import { AppDispatch, RootState } from '@store/store'

import Popup from '../Popup'

const mapState = (state: RootState) => {
    return {
        currentComic: state.comic.current,
    }
}

const mapDispatch = (dispatch: AppDispatch) => {
    return {
        setShowCopyItemsDialog: (comic: ComicId | null) => {
            dispatch(setShowCopyItemsDialog(comic))
        },
        setShowEditLogDialog: (value: true | number) => {
            dispatch(setShowEditLogDialog(value))
        },
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export type OperationsMenuProps = PropsFromRedux & {}

export function OperationsMenu({
    currentComic,
    setShowCopyItemsDialog,
    setShowEditLogDialog,
}: OperationsMenuProps) {
    const [showPopup, setShowPopup] = useState(false)
    const [popupPosition, setPopupPosition] = useState<[number, number]>([0, 0])
    return (
        <>
            <button
                title="Additional operations"
                className="flex-none px-1 block text-xs text-black hover:text-gray-500 focus:text-black visited:text-black border-solid border-l border-stone-300"
                onClick={(e) => {
                    e.preventDefault()
                    setShowPopup(true)
                    const target = e.target as HTMLElement
                    setPopupPosition([
                        target.offsetLeft + target.clientWidth / 2,
                        target.offsetTop + target.clientHeight / 2,
                    ])
                }}
            >
                <i
                    className="fa fa-ellipsis-h text-xl leading-5"
                    aria-hidden
                ></i>
            </button>
            <Popup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                position={popupPosition}
            >
                <div className="px-2 py-1 bg-stone-100 border border-solid border-stone-300 w-72 flex flex-col content-start gap-2 relative">
                    <MenuItem
                        onClick={() => {
                            setShowPopup(false)
                            setShowCopyItemsDialog(currentComic)
                        }}
                    >
                        Copy items from another comic...
                    </MenuItem>
                    <hr className="-mx-2 my-0 border-solid border-b max-w-none" />
                    <MenuItem
                        onClick={() => {
                            setShowPopup(false)
                            setShowEditLogDialog(currentComic)
                        }}
                    >
                        Show edit log for comic {currentComic}...
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setShowPopup(false)
                            setShowEditLogDialog(true)
                        }}
                    >
                        Show edit log...
                    </MenuItem>
                </div>
            </Popup>
        </>
    )
}

export default connector(OperationsMenu)

function MenuItem({
    children,
    onClick,
}: {
    children: React.ReactNode
    onClick: () => void
}) {
    return (
        <button
            className="text-left hover:bg-blue-600 hover:text-white -mx-2 -my-1 p-2"
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }}
        >
            {children}
        </button>
    )
}
