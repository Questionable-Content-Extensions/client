export default function ValueEditor({
    label,
    dirty,
    value,
    setValue,
    isSaving,
}: {
    label: string
    dirty: boolean
    value: string
    setValue: (value: string) => void
    isSaving: boolean
}) {
    return (
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
                className="font-normal not-italic disabled:opacity-50 w-52"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isSaving}
            />
        </label>
    )
}
