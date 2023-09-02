import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FAYE, FAYE_FRIENDS, FAYE_IMAGES } from '~/mocks'
import Settings from '~/settings'

import ItemDetailsDialog from './ItemDetailsDialog'

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
} as ComponentMeta<typeof ItemDetailsDialog>

type ItemDetailsDialogStoryThis = {
    kind: 'Default' | 'Editor' | 'Error'
}
const Template: ComponentStory<typeof ItemDetailsDialog> = function (
    this: ItemDetailsDialogStoryThis,
    args
) {
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
            //http://localhost:3000/api/v2/itemdata/image/4
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
            )
        )
    } else {
        worker.use(
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
            )
        )
    }

    const onClose = () => {
        alert('In the userscript, this window would close now.')
    }

    return <ItemDetailsDialog {...args} onClose={onClose} />
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
