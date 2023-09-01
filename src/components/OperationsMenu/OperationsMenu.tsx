import { useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { ComicId } from '@models/ComicId'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
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
    }
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type OperationsProps = PropsFromRedux & {}

export function OperationsMenu({
    currentComic,
    setShowCopyItemsDialog,
}: OperationsProps) {
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
                    setPopupPosition([target.offsetLeft, target.offsetTop])
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
                <div className="p-2 bg-stone-100 border border-solid border-stone-300 w-72">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setShowPopup(false)
                            setShowCopyItemsDialog(currentComic)
                        }}
                    >
                        Copy items from another comic...
                    </button>
                </div>
            </Popup>
        </>
    )
}

export default connector(OperationsMenu)
