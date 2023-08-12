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
}: {
    label: string
    kind?: Kind
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    checked?: boolean
}) {
    let background
    let dot
    if (kind === undefined || kind === Kind.Skinny) {
        background = (
            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
        )
        dot = (
            <div
                className={
                    'absolute w-6 h-6 bg-gray-100 border border-white border-solid rounded-full shadow -left-1 -top-1 transition ' +
                    style.dot
                }
            ></div>
        )
    } /* if THICC */ else {
        background = (
            <div className="block bg-gray-400 w-14 h-8 rounded-full"></div>
        )
        dot = (
            <div
                className={
                    'dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ' +
                    style.dot
                }
            ></div>
        )
    }
    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className={'sr-only ' + style.toggle}
                    onChange={onChange}
                    checked={checked}
                />
                {background}
                {dot}
            </div>
            <div className="ml-3 text-gray-700 font-medium">{label}</div>
        </label>
    )
}
