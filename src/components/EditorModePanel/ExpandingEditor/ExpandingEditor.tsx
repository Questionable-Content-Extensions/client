import { createContext, useState } from 'react'

export const ExpandedContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}])

export default function ExpandingEditor({
    children,
}: {
    children: React.ReactChild
}) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className={
                'mt-2 transition-[width] ' +
                (expanded ? 'lg:w-[1080px] lg:shadow-md' : 'lg:w-60')
            }
        >
            <ExpandedContext.Provider value={[expanded, setExpanded]}>
                {children}
            </ExpandedContext.Provider>
        </div>
    )
}
