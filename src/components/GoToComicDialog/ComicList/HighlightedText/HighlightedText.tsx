import React, { useMemo } from 'react'

export default function HighlightedText({
    text,
    highlights,
}: {
    text: string
    highlights: string[]
}) {
    const highlightIndexes = highlights
        .map((highlight) => getIndicesOf(text, highlight))
        .flat()
        .sort((i, j) => i[0] - j[0])

    // combine overlapping highlights
    const combinedHighlights = useMemo(() => {
        const combinedHighlights = [...highlightIndexes]
        restart: while (true) {
            for (let i = 0; i < combinedHighlights.length - 1; i++) {
                const current = combinedHighlights[i]
                const next = combinedHighlights[i + 1]

                if (next[0] < current[0] + current[1]) {
                    combinedHighlights.splice(i, 2, [
                        Math.min(current[0], next[0]),
                        Math.max(current[0] + current[1], next[0] + next[1]),
                    ])
                    continue restart
                }
            }
            break
        }
        return combinedHighlights
    }, [highlightIndexes])

    if (!highlightIndexes.length) {
        return <>{text}</>
    }

    const highlightPieces: JSX.Element[] = []
    let startIndex = 0
    for (const index of combinedHighlights) {
        if (startIndex !== index[0]) {
            highlightPieces.push(
                <React.Fragment key={startIndex}>
                    {text.substring(startIndex, index[0])}
                </React.Fragment>
            )
        }
        highlightPieces.push(
            <span
                className="bg-yellow-400 text-black"
                key={`${index[0]}-${index[1]}`}
            >
                {text.substring(index[0], index[0] + index[1])}
            </span>
        )
        startIndex = index[0] + index[1]
    }
    if (startIndex < text.length) {
        highlightPieces.push(
            <React.Fragment key={startIndex}>
                {text.substring(startIndex)}
            </React.Fragment>
        )
    }

    return <>{highlightPieces}</>
}

function getIndicesOf(
    haystack: string,
    needle: string,
    caseSensitive?: boolean
) {
    let needleLength = needle.length
    if (!needleLength) {
        return []
    }

    let startIndex = 0
    let index
    let indices: [number, number][] = []
    if (!caseSensitive) {
        haystack = haystack.toUpperCase()
        needle = needle.toUpperCase()
    }
    while ((index = haystack.indexOf(needle, startIndex)) !== -1) {
        indices.push([index, needleLength])
        startIndex = index + needleLength
    }
    return indices
}
