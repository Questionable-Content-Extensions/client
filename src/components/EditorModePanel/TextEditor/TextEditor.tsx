import { useContext } from 'react'

import { ExpandedContext } from '@components/EditorModePanel/ExpandingEditor/ExpandingEditor'

export default function TextEditor({
    disabled,
    label,
    labelTitle,
    inputId,
    value,
    onValueChange,
    dirty,
}: {
    disabled: boolean
    label: string
    labelTitle?: string
    inputId: string
    value: string
    onValueChange: (newValue: string) => void
    dirty?: boolean
}) {
    const [_expanded, setExpanded] = useContext(ExpandedContext)
    return (
        <div className="flex min-w-0">
            <label
                title={labelTitle}
                htmlFor={inputId}
                className={
                    `bg-qc-header text-white py-2 px-4 flex-initial rounded-l-sm rounded-r-none` +
                    (dirty ? ' bg-qc-header-second italic' : '') +
                    (disabled ? ' opacity-75' : '')
                }
            >
                {label}
                {dirty ? '*' : ''}
            </label>
            <input
                id={inputId}
                type="text"
                placeholder={labelTitle ?? label}
                value={value}
                title={dirty ? `${value} (changed)` : value}
                onChange={(e) => onValueChange(e.target.value)}
                className={
                    'min-w-0 border border-qc-header focus:outline-none flex-auto rounded-none pl-2 disabled:opacity-75' +
                    (disabled ? ' cursor-not-allowed' : '')
                }
                disabled={disabled}
                onFocus={() => setExpanded(true)}
                onBlur={() => setExpanded(false)}
            />
        </div>
    )
}
