import { useState } from 'react'

import {
    setShowCopyItemsDialog,
    setShowEditLogDialog,
} from '@store/dialogSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'

import Popup from '../Popup'

// eslint-disable-next-line no-empty-pattern
export default function OperationsMenu({}: {}) {
    const dispatch = useAppDispatch()

    const currentComic = useAppSelector((state) => state.comic.current)

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
                    const target = e.currentTarget
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
                            dispatch(setShowCopyItemsDialog(currentComic))
                        }}
                    >
                        Copy items from another comic...
                    </MenuItem>
                    <hr className="-mx-2 my-0 border-solid border-b max-w-none" />
                    <MenuItem
                        onClick={() => {
                            setShowPopup(false)
                            dispatch(setShowEditLogDialog(currentComic))
                        }}
                    >
                        Show edit log for comic {currentComic}...
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setShowPopup(false)
                            dispatch(setShowEditLogDialog(true))
                        }}
                    >
                        Show edit log...
                    </MenuItem>
                </div>
            </Popup>
        </>
    )
}

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
