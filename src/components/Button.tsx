export type ButtonProps = {
    children: React.ReactNode
    className?: string
} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>
export default function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            className={
                'bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white rounded-sm disabled:opacity-75' +
                (className ? ` ${className}` : '')
            }
            {...rest}
        >
            {children}
        </button>
    )
}

export function PaddedButton({ children, className, ...rest }: ButtonProps) {
    return (
        <Button
            className={'py-3 px-4' + (className ? ` ${className}` : '')}
            {...rest}
        >
            {children}
        </Button>
    )
}
