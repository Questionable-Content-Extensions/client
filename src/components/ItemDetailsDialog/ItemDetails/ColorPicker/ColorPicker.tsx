import { useState } from 'react'
import { SketchPicker } from 'react-color'

import Popup from '@components/Popup'

import { createTintOrShade } from '~/color'

export default function ColorPicker({
    color,
    setColor,
    resetColor,
    isColorDirty,
    isSaving,
}: {
    color: string
    setColor: (color: string) => void
    resetColor: () => void
    isColorDirty: boolean
    isSaving: boolean
}) {
    const foregroundColor = createTintOrShade(color)

    const [showPicker, setShowPicker] = useState(false)

    return (
        <>
            <span className="ml-2 p-1 bg-white border border-solid border-gray-200 rounded-sm inline-block cursor-pointer align-middle">
                <button
                    className="w-9 h-5 rounded-sm block"
                    style={{ backgroundColor: `${color}` }}
                    onClick={(e) => {
                        e.preventDefault()
                        setShowPicker((s) => !s)
                    }}
                    title="Pick color"
                    disabled={isSaving}
                >
                    <i
                        className="fa fa-eyedropper block text-center pt-0.5"
                        style={{ color: foregroundColor }}
                        aria-hidden="true"
                    ></i>
                </button>
                <Popup show={showPicker} onClose={() => setShowPicker(false)}>
                    <SketchPicker
                        color={color}
                        disableAlpha={true}
                        onChange={(r) => {
                            setColor(r.hex)
                        }}
                        presetColors={[]}
                    />
                </Popup>
            </span>

            <span className="p-1 ml-1 inline-block align-middle rounded-sm border border-solid border-gray-200">
                <button
                    className="h-5 w-5 block disabled:opacity-75 "
                    onClick={(e) => {
                        e.preventDefault()
                        resetColor()
                    }}
                    title="Reset color"
                    disabled={!isColorDirty || isSaving}
                >
                    <i
                        className="fa fa-refresh block text-center pt-0.5"
                        aria-hidden="true"
                    ></i>
                </button>
            </span>
        </>
    )
}
