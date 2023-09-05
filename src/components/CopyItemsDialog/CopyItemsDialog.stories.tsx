import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
import store from '@store/store'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
    ALL_ITEMS,
    COMIC_DATA_666,
    getComicListMocks,
    useMswReady,
} from '~/mocks'

import CopyItemsDialog from './CopyItemsDialog'

export default {
    component: CopyItemsDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof CopyItemsDialog>

const Template: ComponentStory<typeof CopyItemsDialog> = (args) => {
    const mswReady = useMswReady()

    store.dispatch(apiSlice.util.resetApiState())

    // Let's set up the Redux store to be the way we need
    const state = store.getState()
    if (!state.dialog.showCopyItemsDialogFor) {
        store.dispatch(setShowCopyItemsDialog(666))
    }
    if (state.comic.current !== 667) {
        store.dispatch(setCurrentComic(667))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    worker.use(
        rest.get('http://localhost:3000/api/v2/itemdata/', (req, res, ctx) => {
            const all = [...ALL_ITEMS]
            const name =
                'This is a mocked API response and will only be accurate for comic 666'
            all.push({
                id: -1,
                name,
                shortName: name,
                count: 0,
                type: 'storyline',
                color: 'ffaabb',
            })
            return res(ctx.json(all))
        }),
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                const { comicId } = req.params
                if (comicId === '666') {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(COMIC_DATA_666)
                    )
                } else {
                    const comic: Comic = {
                        ...COMIC_DATA_666,
                        items: [
                            ...(COMIC_DATA_666 as PresentComic).items,
                            {
                                id: -1,
                                first: 0,
                                last: 0,
                                next: 0,
                                previous: 0,
                            },
                        ],
                    } as any
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(comic)
                    )
                }
            }
        ),
        rest.get('http://localhost:3000/api/v2/comicdata/', (req, res, ctx) => {
            return res(ctx.json(getComicListMocks(1000)))
        }),
        rest.post(
            'http://localhost:3000/api/v2/comicdata/additems',
            (req, res, ctx) => {
                // We pretend this takes 1-2 seconds so we get to
                // observe the loading UX
                return res(
                    ctx.delay(1000 + Math.random() * 1000),
                    ctx.text('Items added to comic')
                )
            }
        )
    )

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return mswReady ? <CopyItemsDialog {...args} onClose={onClose} /> : <></>
}

export const Default = Template.bind({})
Default.args = {
    show: true,
}
