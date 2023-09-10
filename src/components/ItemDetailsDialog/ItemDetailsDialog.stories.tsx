import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import { Meta, StoryFn } from '@storybook/react'

import {
    ALL_ITEMS,
    COMIC_DATA_666,
    FAYE,
    FAYE_EDIT_LOG,
    FAYE_FRIENDS,
    FAYE_IMAGES,
    useMswReady,
} from '~/mocks'
import Settings from '~/settings'

import ItemDetailsDialog from './ItemDetailsDialog'
import { FAYE_COMICS } from '../../mocks'

const fayeImage: any = require('./4.png')

export default {
    component: ItemDetailsDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
} as Meta<typeof ItemDetailsDialog>

type ItemDetailsDialogStoryThis = {
    kind: 'Default' | 'Editor' | 'Error'
}
const Template: StoryFn<typeof ItemDetailsDialog> = function (
    this: ItemDetailsDialogStoryThis,
    args
) {
    const mswReady = useMswReady()

    // Let's set up the Redux store to be the way we need
    const state = store.getState()
    store.dispatch(apiSlice.util.resetApiState())
    if (
        !state.dialog.showItemDetailsDialogFor ||
        state.dialog.showItemDetailsDialogFor !== args.initialItemId
    ) {
        store.dispatch(setShowItemDetailsDialogFor(args.initialItemId))
    }
    if (state.comic.current !== 666) {
        store.dispatch(setCurrentComic(666))
    }
    if (this.kind === 'Editor') {
        store.dispatch(
            setSettings({
                ...Settings.DEFAULTS,
                editMode: true,
                editModeToken: '00000000-0000-0000-0000-000000000000',
            })
        )
    } else {
        store.dispatch(setSettings(Settings.DEFAULTS))
    }

    // Then, let's fake the necessary REST calls
    const { worker, rest } = window.msw
    if (this.kind !== 'Error') {
        worker.use(
            rest.get(
                'http://localhost:3000/api/v2/itemdata/',
                (req, res, ctx) => {
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
                }
            ),
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
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(FAYE)
                    )
                }
            ),
            rest.patch(
                'http://localhost:3000/api/v2/itemdata/:itemId',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.text('Fake success!')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/comics',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(FAYE_COMICS)
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/images',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(FAYE_IMAGES)
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/friends',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(FAYE_FRIENDS)
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/locations',
                (req, res, ctx) => {
                    //const { itemId } = req.params
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(FAYE_FRIENDS)
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/image/:imageId',
                async (req, res, ctx) => {
                    const imageBuffer = await fetch(fayeImage).then((res) =>
                        res.arrayBuffer()
                    )
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.set(
                            'Content-Length',
                            imageBuffer.byteLength.toString()
                        ),
                        ctx.set('Content-Type', 'image/png'),
                        ctx.body(imageBuffer)
                    )
                }
            ),
            rest.delete(
                'http://localhost:3000/api/v2/itemdata/image/:imageId',
                async (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.text('Image deleted')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/itemdata/:itemId/images/primary',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.text('Image set as primary')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/comicdata/additem',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.text('Item added to comic')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/comicdata/removeitem',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.text('Item removed from comic')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/log/item',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    const page = Number(req.url.searchParams.get('page'))
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json({ ...FAYE_EDIT_LOG, page })
                    )
                }
            )
        )
    } else {
        worker.use(
            rest.get(
                'http://localhost:3000/api/v2/itemdata/',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.patch(
                'http://localhost:3000/api/v2/itemdata/:itemId',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/images',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/friends',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/:itemId/locations',
                (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.get(
                'http://localhost:3000/api/v2/itemdata/image/:imageId',
                async (req, res, ctx) => {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.delete(
                'http://localhost:3000/api/v2/itemdata/image/:imageId',
                async (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/comicdata/additem',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/comicdata/removeitem',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            ),
            rest.post(
                'http://localhost:3000/api/v2/log/item',
                (req, res, ctx) => {
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.status(500),
                        ctx.text('Server Error')
                    )
                }
            )
        )
    }

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return mswReady ? <ItemDetailsDialog {...args} onClose={onClose} /> : <></>
}

export const Default = Template.bind({ kind: 'Default' })
Default.args = {
    initialItemId: 4,
}

export const Editor = Template.bind({ kind: 'Editor' })
Editor.args = {
    initialItemId: 4,
}

export const Error = Template.bind({ kind: 'Error' })
Error.args = {
    initialItemId: 4,
}
