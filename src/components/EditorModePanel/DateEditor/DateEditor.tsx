import { useContext } from 'react'

import { ExpandedContext } from '@components/EditorModePanel/ExpandingEditor/ExpandingEditor'
import ToggleButton from '@components/ToggleButton/ToggleButton'

export default function DateEditor({
    disabled,
    label,
    labelTitle,
    inputId,
    dateValue,
    isAccurateValue,
    onDateValueChange,
    onIsAccurateValueChange,
    isDateValueDirty,
    isIsAccurateValueDirty,
}: {
    disabled: boolean
    label: string
    labelTitle?: string
    inputId: string
    dateValue: string
    isAccurateValue: boolean
    isDateValueDirty: boolean
    isIsAccurateValueDirty: boolean
    onDateValueChange: (newValue: string) => void
    onIsAccurateValueChange: (newValue: boolean) => void
}) {
    const [_expanded, setExpanded] = useContext(ExpandedContext)

    function toISOLocal(d: Date) {
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, -1)
    }
    let dateString, niceDateString
    try {
        dateString = toISOLocal(new Date(dateValue))
        const niceDate = new Date(dateString)
        niceDateString = `${niceDate.toDateString()}, ${niceDate.toTimeString()}`
    } catch {
        dateString = ''
        niceDateString = ''
    }

    return (
        <>
            <div className="flex min-w-0">
                <label
                    title={labelTitle}
                    htmlFor={inputId}
                    className={
                        `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                        (isDateValueDirty
                            ? ' bg-qc-header-second italic'
                            : '') +
                        (disabled ? ' opacity-75' : '')
                    }
                >
                    {label}
                    {isDateValueDirty ? '*' : ''}
                </label>

                <input
                    id={inputId}
                    type="datetime-local"
                    placeholder={labelTitle ?? label}
                    value={dateString}
                    title={niceDateString}
                    onChange={(e) => {
                        try {
                            onDateValueChange(
                                new Date(e.target.value).toISOString()
                            )
                        } catch {}
                    }}
                    className={
                        'min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75' +
                        (disabled ? ' cursor-not-allowed' : '')
                    }
                    disabled={disabled}
                    onFocus={() => setExpanded(true)}
                    onBlur={() => setExpanded(false)}
                />
            </div>
            <div className="bg-stone-100">
                <ToggleButton
                    label="Accurate Date"
                    checked={isAccurateValue}
                    disabled={disabled}
                    onChange={(e) => onIsAccurateValueChange(e.target.checked)}
                    dirty={isIsAccurateValueDirty}
                />
            </div>
        </>
    )
}
