import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'

import { ItemType } from '@models/ItemType'
import { makeStore } from '@store/store'
import { render, screen } from '@testing-library/react'

import { FAYE, FAYE_FRIENDS, FAYE_IMAGES, FAYE_LOCATIONS } from '~/mocks'

import ItemDataPanel, {
    involvesCastText,
    involvesLocationText,
} from './ItemDataPanel'

describe('involvesLocationText', () => {
    it('returns the expected phrase for each known ItemType', () => {
        expect(involvesLocationText('cast')).toBe('spotted at')
        expect(involvesLocationText('location')).toBe(
            'visited simultaneously with'
        )
        expect(involvesLocationText('storyline')).toBe('involves the places')
    })

    it('throws instead of silently returning undefined for an unknown type', () => {
        expect(() => involvesLocationText('event' as ItemType)).toThrow(
            /Unhandled ItemType/
        )
    })
})

describe('involvesCastText', () => {
    it('returns the expected phrase for each known ItemType', () => {
        expect(involvesCastText('cast')).toBe('spotted with')
        expect(involvesCastText('location')).toBe('visited by')
        expect(involvesCastText('storyline')).toBe('involves the people')
    })

    it('throws instead of silently returning undefined for an unknown type', () => {
        expect(() => involvesCastText('event' as ItemType)).toThrow(
            /Unhandled ItemType/
        )
    })
})

describe('ItemDataPanel', () => {
    it('keeps showing the loading state instead of crashing when itemData has loaded but itemEditor.color has not been synced yet', () => {
        // Regression test: itemData/itemImageData/etc. are props, while
        // `color` comes from a separate Redux slice that's only populated by
        // a useEffect in the parent dialog, one render after itemData first
        // becomes available. That gap used to reach createTintOrShade('')
        // and throw "Invalid hex color: \"\"".
        const store = makeStore()

        expect(() =>
            render(
                <Provider store={store}>
                    <ItemDataPanel
                        itemData={FAYE}
                        itemImageData={FAYE_IMAGES}
                        itemFriendData={FAYE_FRIENDS}
                        itemLocationData={FAYE_LOCATIONS}
                        editModeToken={null}
                        itemDataUrl="http://localhost:3000"
                        onGoToComic={() => {}}
                        onShowItemData={() => {}}
                        onDeleteImage={() => {}}
                        onSetPrimaryImage={() => {}}
                        hasError={false}
                        onUploadImage={() => Promise.resolve()}
                        isUploadingImage={false}
                    />
                </Provider>
            )
        ).not.toThrow()

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})
