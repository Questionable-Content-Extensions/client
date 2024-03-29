import styles from './CollapsibleDetails.module.css'

export default function CollapsibleDetails({
    summary,
    children,
    initiallyOpen,
    indentChildren,
    onToggle,
}: {
    summary: string
    children: React.ReactNode
    initiallyOpen?: boolean
    indentChildren?: boolean
    onToggle?: React.ReactEventHandler<HTMLDetailsElement>
}) {
    return (
        <details
            className={styles.details}
            open={initiallyOpen}
            onToggle={onToggle}
        >
            <summary className="py-4 mb-2 flex items-center font-bold border-0 border-b border-solid border-gray-200">
                {summary}
                <button className="ml-auto">
                    <svg
                        className="fill-current opacity-75 w-4 h-4 -mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </button>
            </summary>

            <div className={indentChildren ? 'mx-5' : ''}>{children}</div>
        </details>
    )
}
