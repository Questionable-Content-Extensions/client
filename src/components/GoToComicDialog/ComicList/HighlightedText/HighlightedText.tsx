import React from 'react'

export default function HighlightedText({
    text,
    highlight,
}: {
    text: string
    highlight: string
}) {
    const highlightIndexes = getIndicesOf(text, highlight)
    if (!highlightIndexes.length) {
        return <>{text}</>
    }
    const highlightPieces: JSX.Element[] = []
    let startIndex = 0
    for (const index of highlightIndexes) {
        if (startIndex !== index) {
            highlightPieces.push(
                <React.Fragment key={startIndex}>
                    {text.substring(startIndex, index)}
                </React.Fragment>
            )
        }
        highlightPieces.push(
            <span className="bg-yellow-400 text-black" key={index}>
                {text.substring(index, index + highlight.length)}
            </span>
        )
        startIndex = index + highlight.length
    }
    if (startIndex < text.length - 1) {
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
    let indices: number[] = []
    if (!caseSensitive) {
        haystack = haystack.toUpperCase()
        needle = needle.toUpperCase()
    }
    while ((index = haystack.indexOf(needle, startIndex)) !== -1) {
        indices.push(index)
        startIndex = index + needleLength
    }
    return indices
}
