import { HttpResponse, http } from 'msw'
import { expect, waitFor, within } from 'storybook/test'

import { Comic } from '@models/Comic'
import { Item } from '@models/Item'
import { PresentComic } from '@models/PresentComic'
import { itemApiSlice } from '@store/api/itemApiSlice'
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
import { mockNetworkDelay } from '~/storybook/mockNetworkDelay'
import { waitForPendingQueriesToSettle } from '~/storybook/waitForPendingQueriesToSettle'
import { withSuppressedExpectedErrorAsync } from '~/util/testUtils'

import fayeImage from './4.png'
import ItemDetailsDialog from './ItemDetailsDialog'

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
            startComicId: null,
            endComicId: null,
        })
        return HttpResponse.json(all)
    }),
    http.get(
        'http://localhost:3000/api/v3/comicdata/:comicId',
        async ({ params }) => {
            const { comicId } = params
            await mockNetworkDelay()
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
        await mockNetworkDelay()
        return HttpResponse.json(FAYE)
    }),
    http.patch('http://localhost:3000/api/v3/itemdata/:itemId', async () => {
        await mockNetworkDelay()
        return HttpResponse.text('Fake success!')
    }),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/comics',
        async () => {
            await mockNetworkDelay()
            return HttpResponse.json(FAYE_COMICS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/images',
        async () => {
            await mockNetworkDelay()
            return HttpResponse.json(FAYE_IMAGES)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/friends',
        async () => {
            await mockNetworkDelay()
            return HttpResponse.json(FAYE_FRIENDS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/:itemId/locations',
        async () => {
            await mockNetworkDelay()
            return HttpResponse.json(FAYE_FRIENDS)
        }
    ),
    http.get(
        'http://localhost:3000/api/v3/itemdata/image/:imageId',
        async () => {
            const imageBuffer = await fetch(fayeImage).then((res) =>
                res.arrayBuffer()
            )
            await mockNetworkDelay()
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
            await mockNetworkDelay()
            return HttpResponse.text('Image deleted')
        }
    ),
    http.post(
        'http://localhost:3000/api/v3/itemdata/:itemId/images/primary',
        async () => {
            await mockNetworkDelay()
            return HttpResponse.text('Image set as primary')
        }
    ),
    http.post('http://localhost:3000/api/v3/comicdata/additem', async () => {
        await mockNetworkDelay()
        return HttpResponse.text('Item added to comic')
    }),
    http.post('http://localhost:3000/api/v3/comicdata/removeitem', async () => {
        await mockNetworkDelay()
        return HttpResponse.text('Item removed from comic')
    }),
    http.get('http://localhost:3000/api/v3/log/item', async ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'))
        await mockNetworkDelay()
        return HttpResponse.json({ ...FAYE_EDIT_LOG, page })
    }),
]

const SERVER_ERROR = async () => {
    await mockNetworkDelay()
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
    http.get('http://localhost:3000/api/v3/log/item', SERVER_ERROR),
]

// Regression coverage for a bug where a background `patchItem` mutation
// (e.g. from `ItemNavigation`'s "attach out-of-range storyline" flow)
// invalidating the same item that's already loaded in this dialog didn't
// re-sync `itemEditor` state, leaving stale values in the editor fields.
// This mock server state is mutated by the PATCH handler so a subsequent
// GET reflects it, mirroring the real invalidate-then-refetch flow.
const STORYLINE_TEST_ITEM: Item = {
    id: 4,
    shortName: 'Test Arc',
    name: 'Test Arc',
    type: 'storyline',
    color: 'ffaabb',
    startComicId: 100,
    endComicId: 110,
    first: 100,
    last: 109,
    appearances: 10,
    totalComics: 10,
    presence: 100,
    hasImage: false,
    primaryImage: null,
}

// Mutable across requests within a single play run (so the PATCH handler can
// affect the subsequent GET), but reset via `resetResyncTestState()` at the
// start of every run — `createResyncTestHandlers()` is only invoked once, at
// module-eval time, so without an explicit reset this would still hold
// whatever a *previous* run last patched it to (e.g. when re-running the
// play function from Storybook's Interactions panel, which doesn't reload
// the page/module), causing the first `waitFor` to time out.
let storylineItem: Item = { ...STORYLINE_TEST_ITEM }

function resetResyncTestState() {
    storylineItem = { ...STORYLINE_TEST_ITEM }
}

function createResyncTestHandlers() {
    return [
        http.get('http://localhost:3000/api/v3/itemdata/:itemId', async () => {
            await mockNetworkDelay()
            return HttpResponse.json(storylineItem)
        }),
        http.patch(
            'http://localhost:3000/api/v3/itemdata/:itemId',
            async ({ request }) => {
                const body = (await request.json()) as {
                    startComicId?: number
                    endComicId?: number
                }
                storylineItem = {
                    ...storylineItem,
                    ...(body.startComicId !== undefined
                        ? { startComicId: body.startComicId }
                        : {}),
                    ...(body.endComicId !== undefined
                        ? { endComicId: body.endComicId }
                        : {}),
                }
                await mockNetworkDelay()
                return HttpResponse.json(storylineItem)
            }
        ),
    ]
}

const meta: Meta<typeof ItemDetailsDialog> = {
    component: ItemDetailsDialog,
    args: {
        initialItemId: 4,
        onClose: () => {
            // Under Vitest, `alert` has no dismiss button to click, so it'd
            // just block the story - only show it for a real interactive
            // Storybook preview.
            if (import.meta.env.MODE !== 'test') {
                alert('In the userscript, this window would close now.')
            }
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // All `errorHandlers` respond 500, which the store logs via
        // apiSlice's `error(...)` call - expected here, so suppress it to
        // keep it from showing up as test-runner noise.
        await withSuppressedExpectedErrorAsync(
            'Got unexpected response from server',
            async () => {
                await waitFor(
                    () =>
                        expect(
                            canvas.getAllByText(
                                /An error occurred loading the item data/
                            )[0]
                        ).toBeInTheDocument(),
                    { timeout: 15000 }
                )

                // The error text can render as soon as the *first* query
                // fails, while slower ones are still in flight - keep
                // suppressing until all of them have settled too, so their
                // logs can't leak into the next story's captured output.
                await waitForPendingQueriesToSettle(15000)
            }
        )
    },
}

// Regression coverage for a bug where `onGoToComic` called `setCurrentComic`
// without wrapping it in `dispatch`, making it a silent no-op.
export const NavigatesToFeaturedComic: Story = {
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const summary = await waitFor(() =>
            canvas.getByText('Comics item is featured in')
        )
        summary.click()

        const comicButton = await waitFor(
            () => canvas.getByText(/Comic 4805:/),
            { timeout: 15000 }
        )
        comicButton.click()

        await waitFor(() => expect(store.getState().comic.current).toBe(4805))
    },
}

export const ResyncsAfterBackgroundPatch: Story = {
    parameters: {
        msw: {
            handlers: [...createResyncTestHandlers(), ...successHandlers],
        },
    },
    loaders: [
        () => {
            resetResyncTestState()
            store.dispatch(
                setSettings({
                    ...Settings.DEFAULTS,
                    editMode: true,
                    editModeToken: '00000000-0000-0000-0000-000000000000',
                })
            )
        },
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // `endComicId` 110 is exclusive on the wire, displayed as the
        // inclusive 109 in the editor.
        await waitFor(
            () => expect(canvas.getByLabelText(/End comic/)).toHaveValue(109),
            { timeout: 15000 }
        )

        // Simulate another part of the UI (e.g. ItemNavigation's
        // "attach out-of-range storyline" flow) patching this same item's
        // endComicId while this dialog is still open on it — this must
        // re-sync the editor fields, not leave them showing stale data.
        await store.dispatch(
            itemApiSlice.endpoints.patchItem.initiate({
                item: 4,
                body: {
                    endComicId: 121,
                },
            })
        )

        await waitFor(
            () => expect(canvas.getByLabelText(/End comic/)).toHaveValue(120),
            { timeout: 15000 }
        )
    },
}
