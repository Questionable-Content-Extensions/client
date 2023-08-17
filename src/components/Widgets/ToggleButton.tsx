import style from './ToggleButton.module.css'

export enum Kind {
    Skinny,
    Thick,
}

export default function ToggleButton({
    label,
    kind,
    onChange,
    checked,
    disabled,
    title,
}: {
    label: string
    kind?: Kind
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    checked?: boolean
    disabled?: boolean
    title?: string
}) {
    let background
    let dot
    if (kind === undefined || kind === Kind.Skinny) {
        background = (
            <div
                className={
                    'w-10 h-4 bg-gray-400 rounded-full shadow-inner transition-[background-color] ' +
                    `${style.background} ${style.skinny}` +
                    (disabled ? ` ${style.disabled}` : '')
                }
            ></div>
        )
        dot = (
            <div
                className={
                    'absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform ' +
                    `${style.dot} ${style.skinny}` +
                    (disabled ? ` ${style.disabled}` : '')
                }
            ></div>
        )
    } /* if THICC */ else {
        background = (
            <div
                className={
                    'block bg-gray-400 w-14 h-8 rounded-full transition-[background-color] ' +
                    `${style.background} ${style.thick}` +
                    (disabled ? ` ${style.disabled}` : '')
                }
            ></div>
        )
        dot = (
            <div
                className={
                    'dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ' +
                    `${style.dot} ${style.thick}` +
                    (disabled ? ` ${style.disabled}` : '')
                }
            ></div>
        )
    }
    return (
        <label
            className={
                'flex items-center ' +
                (disabled ? 'cursor-not-allowed' : 'cursor-pointer')
            }
            title={title}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    className={'sr-only ' + style.toggle}
                    onChange={onChange}
                    checked={checked}
                    disabled={disabled}
                />
                {background}
                {dot}
            </div>
            <div
                className={
                    'ml-3 font-medium ' +
                    (disabled ? 'text-gray-500' : 'text-gray-700')
                }
            >
                {label}
            </div>
        </label>
    )
}
