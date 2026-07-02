import { HttpResponse, delay, http } from 'msw'

import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowItemDetailsDialogFor } from '@store/dialogSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings from '~/Settings'
import {
    ALL_ITEMS,
    COMIC_DATA_666,
    FAYE,
    FAYE_COMICS,
    FAYE_EDIT_LOG,
    FAYE_FRIENDS,
    FAYE_IMAGES,
} from '~/mocks'

import fayeImage from './4.png'
import ItemDetailsDialog from './ItemDetailsDialog'

const DELAY = () => delay(1000 + Math.random() * 1000)

const successHandlers = [
    http.get('http://localhost:3000/api/v3/itemdata/', () => {
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
        return HttpResponse.json(all)
    }),
    http.get(
        'http://localhost:3000/api/v3/comicdata/:comicId',
        async ({ params }) => {
            const { comicId } = params
            await DELAY()
            if (comicId === '666') {
                return HttpResponse.json(COMIC_DATA_666)
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
                } as unknown as Comic
                return HttpResponse.json(comic)
            }
        }
    ),
    http.get('http://localhost:3000/api/v3/itemdata/:itemId', async () => {
        await DELAY()
        return HttpResponse.json(FAYE)
    }),
    http.patch('http://localhost:3000/api/v3/itemdata/:itemId', async () => {
        await DELAY()
        return HttpResponse.text('Fake success!')
    }),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/comics',
        async () => {
            await DELAY()
            return HttpResponse.json(FAYE_COMICS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/images',
        async () => {
            await DELAY()
            return HttpResponse.json(FAYE_IMAGES)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/friends',
        async () => {
            await DELAY()
            return HttpResponse.json(FAYE_FRIENDS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/locations',
        async () => {
            await DELAY()
            return HttpResponse.json(FAYE_FRIENDS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/image/:imageId',
        async () => {
            const imageBuffer = await fetch(fayeImage).then((res) =>
                res.arrayBuffer()
            )
            await DELAY()
            return new HttpResponse(imageBuffer, {
                headers: {
                    'Content-Length': imageBuffer.byteLength.toString(),
                    'Content-Type': 'image/png',
                },
            })
        }
    ),
    http.delete(
        'http://localhost:3000/api/v3/itemdata/image/:imageId',
        async () => {
            // We pretend this takes 1-2 seconds so we get to
            // observe the loading UX
            await DELAY()
            return HttpResponse.text('Image deleted')
        }
    ),
    http.post(
        'http://localhost:3000/api/v3/itemdata/:itemId/images/primary',
        async () => {
            // We pretend this takes 1-2 seconds so we get to
            // observe the loading UX
            await DELAY()
            return HttpResponse.text('Image set as primary')
        }
    ),
    http.post('http://localhost:3000/api/v3/comicdata/additem', async () => {
        // We pretend this takes 1-2 seconds so we get to
        // observe the loading UX
        await DELAY()
        return HttpResponse.text('Item added to comic')
    }),
    http.post('http://localhost:3000/api/v3/comicdata/removeitem', async () => {
        // We pretend this takes 1-2 seconds so we get to
        // observe the loading UX
        await DELAY()
        return HttpResponse.text('Item removed from comic')
    }),
    http.get('http://localhost:3000/api/v3/log/item', async ({ request }) => {
        // We pretend this takes 1-2 seconds so we get to
        // observe the loading UX
        const page = Number(new URL(request.url).searchParams.get('page'))
        await DELAY()
        return HttpResponse.json({ ...FAYE_EDIT_LOG, page })
    }),
]

const SERVER_ERROR = async () => {
    await DELAY()
    return HttpResponse.text('Server Error', { status: 500 })
}

const errorHandlers = [
    http.get('http://localhost:3000/api/v3/itemdata/', SERVER_ERROR),
    http.get('http://localhost:3000/api/v3/itemdata/:itemId', SERVER_ERROR),
    http.patch('http://localhost:3000/api/v3/itemdata/:itemId', SERVER_ERROR),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/images',
        SERVER_ERROR
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/friends',
        SERVER_ERROR
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/locations',
        SERVER_ERROR
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/image/:imageId',
        SERVER_ERROR
    ),
    http.delete(
        'http://localhost:3000/api/v3/itemdata/image/:imageId',
        SERVER_ERROR
    ),
    http.post('http://localhost:3000/api/v3/comicdata/additem', SERVER_ERROR),
    http.post(
        'http://localhost:3000/api/v3/comicdata/removeitem',
        SERVER_ERROR
    ),
    http.post('http://localhost:3000/api/v3/log/item', SERVER_ERROR),
]

const meta: Meta<typeof ItemDetailsDialog> = {
    component: ItemDetailsDialog,
    args: {
        initialItemId: 4,
        onClose: () => {
            alert('In the userscript, this window would close now.')
        },
    },
    loaders: [
        (context) => {
            const state = store.getState()
            store.dispatch(apiSlice.util.resetApiState())
            if (
                !state.dialog.showItemDetailsDialogFor ||
                state.dialog.showItemDetailsDialogFor !==
                    context.args.initialItemId
            ) {
                store.dispatch(
                    setShowItemDetailsDialogFor(context.args.initialItemId)
                )
            }
            if (state.comic.current !== 666) {
                store.dispatch(setCurrentComic(666))
            }
        },
    ],
}
export default meta

type Story = StoryObj<typeof ItemDetailsDialog>

export const Default: Story = {
    parameters: {
        msw: {
            handlers: successHandlers,
        },
    },
    loaders: [
        () => {
            store.dispatch(setSettings(Settings.DEFAULTS))
        },
    ],
}

export const Editor: Story = {
    parameters: {
        msw: {
            handlers: successHandlers,
        },
    },
    loaders: [
        () => {
            store.dispatch(
                setSettings({
                    ...Settings.DEFAULTS,
                    editMode: true,
                    editModeToken: '00000000-0000-0000-0000-000000000000',
                })
            )
        },
    ],
}

export const Error: Story = {
    parameters: {
        msw: {
            handlers: errorHandlers,
        },
    },
    loaders: [
        () => {
            store.dispatch(setSettings(Settings.DEFAULTS))
        },
    ],
}
