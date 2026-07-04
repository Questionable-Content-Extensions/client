import { beforeEach, describe, expect, it, vi } from 'vitest'

import { act, render, screen } from '@testing-library/react'

import ComicImage from './ComicImage'

vi.mock('~/utils', () => ({
    debug: vi.fn(),
    error: vi.fn(),
}))

class FakeImage {
    onload: ((event: Event) => void) | null = null
    onerror: ((event: Event) => void) | null = null
    src = ''

    constructor() {
        instances.push(this)
    }
}

let instances: FakeImage[] = []

beforeEach(() => {
    instances = []
    vi.stubGlobal('Image', FakeImage)
})

describe('ComicImage', () => {
    it('updates the displayed image once loading succeeds', () => {
        const imageReady = vi.fn()
        render(
            <ComicImage
                imageData={{ comicNo: 1, imageType: 'png' }}
                initialComicSrc="initial.png"
                initialComic={1}
                imageReady={imageReady}
                tagline={null}
            />
        )

        expect(instances).toHaveLength(1)
        const image = instances[0]
        expect(image.src).toBe('./comics/1.png')

        act(() => {
            image.onload?.({ target: image } as unknown as Event)
        })

        expect(imageReady).toHaveBeenCalledTimes(1)
        expect(screen.getByRole('img')).toHaveAttribute('src', './comics/1.png')
    })

    it('ignores a stale image load that resolves after navigating to a newer comic', () => {
        const imageReady = vi.fn()
        const { rerender } = render(
            <ComicImage
                imageData={{ comicNo: 1, imageType: 'png' }}
                initialComicSrc="initial.png"
                initialComic={1}
                imageReady={imageReady}
                tagline={null}
            />
        )

        expect(instances).toHaveLength(1)
        const staleImage = instances[0]

        rerender(
            <ComicImage
                imageData={{ comicNo: 2, imageType: 'png' }}
                initialComicSrc="initial.png"
                initialComic={1}
                imageReady={imageReady}
                tagline={null}
            />
        )

        expect(instances).toHaveLength(2)
        const freshImage = instances[1]

        // The older comic's image finally "loads" after the newer navigation
        // has already started. This must not clobber the newer request.
        act(() => {
            staleImage.onload?.({ target: staleImage } as unknown as Event)
        })

        expect(imageReady).not.toHaveBeenCalled()
        expect(screen.getByRole('img')).toHaveAttribute('src', 'initial.png')

        act(() => {
            freshImage.onload?.({ target: freshImage } as unknown as Event)
        })

        expect(imageReady).toHaveBeenCalledTimes(1)
        expect(screen.getByRole('img')).toHaveAttribute('src', './comics/2.png')
    })
})
