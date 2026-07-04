import { useState } from 'react'

import PickComicDialog from '@components/PickComicDialog/PickComicDialog'
import { ComicId } from '@models/ComicId'

export default function ComicIdEditor({
    label,
    dirty,
    value,
    setValue,
    isSaving,
}: {
    label: string
    dirty: boolean
    value: ComicId
    setValue: (value: ComicId) => void
    isSaving: boolean
}) {
    const [showPicker, setShowPicker] = useState(false)

    return (
        <>
            <label
                className={
                    'font-bold' +
                    (dirty ? ' italic' : '') +
                    (dirty ? ' bg-amber-100' : '')
                }
            >
                {label}
                {dirty ? '*' : ''}:{' '}
                <input
                    className="font-normal not-italic disabled:opacity-50 w-24"
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10)
                        setValue(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                    disabled={isSaving}
                />{' '}
                <button
                    type="button"
                    className="font-normal not-italic px-1 disabled:opacity-50"
                    title={`Pick ${label.toLowerCase()} from list`}
                    disabled={isSaving}
                    onClick={(e) => {
                        e.preventDefault()
                        setShowPicker(true)
                    }}
                >
                    <i className="fa fa-list" aria-hidden></i>
                </button>
            </label>
            <PickComicDialog
                show={showPicker}
                onClose={() => setShowPicker(false)}
                onSelectComic={(comic) => {
                    setValue(comic)
                    setShowPicker(false)
                }}
            />
        </>
    )
}
