import { HttpResponse, http } from 'msw'
import { getWorker } from 'msw-storybook-addon'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import { setLatestComic } from '@store/comicSlice'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Settings from '~/Settings'
import { ALL_ITEMS, COMIC_DATA_666 } from '~/mocks'
import { mockNetworkDelay } from '~/storybook/mockNetworkDelay'
import { withSuppressedExpectedErrorAsync } from '~/util/testUtils'

import AddAdvanceComicDialog from './AddAdvanceComicDialog'

const PENDING_COMIC: PresentComic & { comic: number } = {
    ...(COMIC_DATA_666 as PresentComic),
    comic: 5001,
    title: 'A comic from the future',
    tagline: 'Shh, nobody else knows yet',
}

const meta: Meta<typeof AddAdvanceComicDialog> = {
    component: AddAdvanceComicDialog,
    argTypes: {
        show: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        show: true,
        onClose: () => {
            alert('In the userscript, this window would close now.')
        },
    },
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/comicdata/advance',
                    () => {
                        return HttpResponse.json([
                            {
                                comic: PENDING_COMIC.comic,
                                title: PENDING_COMIC.title,
                                tagline: PENDING_COMIC.tagline,
                                publishDate: PENDING_COMIC.publishDate,
                            },
                        ])
                    }
                ),
                http.post(
                    'http://localhost:3000/api/v3/comicdata/advance',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('"Added advance comic #5002"')
                    }
                ),
                http.get(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    ({ params }) => {
                        const { comicId } = params
                        if (Number(comicId) === PENDING_COMIC.comic) {
                            // The item-add picker (FilteredNavigationData)
                            // is driven by the comic response's `allItems`,
                            // not directly by the item list endpoint.
                            return HttpResponse.json({
                                ...PENDING_COMIC,
                                allItems: ALL_ITEMS.map((item) => ({
                                    id: item.id,
                                    first: item.id,
                                    previous: null,
                                    next: null,
                                    last: item.id,
                                })),
                            })
                        }
                        return HttpResponse.json({
                            comic: Number(comicId),
                            editorData: { present: false },
                            hasData: false,
                        })
                    }
                ),
                http.patch(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('"Comic updated"')
                    }
                ),
                http.get('http://localhost:3000/api/v3/itemdata/', () => {
                    return HttpResponse.json(ALL_ITEMS)
                }),
                http.post(
                    'http://localhost:3000/api/v3/comicdata/additem',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('"Added item to comic"')
                    }
                ),
                http.post(
                    'http://localhost:3000/api/v3/comicdata/removeitem',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('"Removed item from comic"')
                    }
                ),
            ],
        },
    },
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())
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
export default meta

type Story = StoryObj<typeof AddAdvanceComicDialog>

export const Default: Story = {}

export const ComicIdDefaultsToLatestPlusOne: Story = {
    loaders: [
        () => {
            store.dispatch(setLatestComic(2500))
        },
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(() =>
            expect(canvas.getByLabelText('Comic ID')).toHaveValue(2501)
        )
    },
}

export const CreateComicEntersEditMode: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(() =>
            expect(
                canvas.getByRole('heading', { name: 'Add advance comic' })
            ).toBeInTheDocument()
        )

        // Reuse the pending comic's id so the edit-mode GET mock resolves,
        // proving the dialog switches straight into edit mode (with items
        // available to add) right after a successful create — no need for
        // a second click on the newly-listed pending comic.
        const comicIdInput = canvas.getByLabelText('Comic ID')
        await userEvent.clear(comicIdInput)
        await userEvent.type(comicIdInput, String(PENDING_COMIC.comic))
        await userEvent.type(canvas.getByLabelText('Title'), 'A new comic')
        await userEvent.click(canvas.getByLabelText('Accurate date'))

        await userEvent.click(
            canvas.getByRole('button', { name: 'Add advance comic' })
        )

        await waitFor(
            () =>
                expect(
                    canvas.getByRole('heading', {
                        name: `Edit advance comic #${PENDING_COMIC.comic}`,
                    })
                ).toBeInTheDocument(),
            { timeout: 3000 }
        )
    },
}

export const EditPendingComic: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(() =>
            expect(
                canvas.getByText(
                    `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
                )
            ).toBeInTheDocument()
        )

        // Selecting a pending advance comic must not go through the normal
        // comic-navigation state, since that would push real browser
        // history to the unpublished comic's URL on the live site.
        await userEvent.click(
            canvas.getByText(`#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`)
        )

        await waitFor(() =>
            expect(
                canvas.getByText(`Edit advance comic #${PENDING_COMIC.comic}`)
            ).toBeInTheDocument()
        )
        await expect(store.getState().comic.current).toEqual(0)

        await waitFor(() =>
            expect(
                canvas.getByDisplayValue(PENDING_COMIC.title)
            ).toBeInTheDocument()
        )
    },
}

export const AddFails: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/comicdata/advance',
                    () => {
                        return HttpResponse.json([])
                    }
                ),
                http.post(
                    'http://localhost:3000/api/v3/comicdata/advance',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('Server Error', {
                            status: 500,
                        })
                    }
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(() =>
            expect(
                canvas.getByRole('heading', { name: 'Add advance comic' })
            ).toBeInTheDocument()
        )

        const comicIdInput = canvas.getByLabelText('Comic ID')
        await userEvent.clear(comicIdInput)
        await userEvent.type(comicIdInput, '5003')
        await userEvent.type(canvas.getByLabelText('Title'), 'A new comic')

        await withSuppressedExpectedErrorAsync(
            'Got unexpected response from server',
            async () => {
                await userEvent.click(
                    canvas.getByRole('button', { name: 'Add advance comic' })
                )

                await waitFor(() =>
                    expect(
                        canvas.getByText(
                            'Failed to add advance comic. See notification for details.'
                        )
                    ).toBeInTheDocument()
                )
            }
        )

        // The dialog must stay in create mode - it never navigates into
        // edit mode on a failed add.
        await expect(
            canvas.getByRole('heading', { name: 'Add advance comic' })
        ).toBeInTheDocument()
    },
}

export const EditPendingComicItems: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(
            await canvas.findByText(
                `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
            )
        )

        await waitFor(() =>
            expect(
                canvas.getByText(`Edit advance comic #${PENDING_COMIC.comic}`)
            ).toBeInTheDocument()
        )

        // Faye is already present on the mocked comic (item id 4). Removing
        // her must hit the comic-id-scoped removeItem mutation directly,
        // never touching comic navigation state.
        const removeFayeButton = await canvas.findByTitle(
            'Remove Faye from comic'
        )
        await userEvent.click(removeFayeButton)

        // Claire is not present on the mocked comic. Adding her via the
        // filter/add flow must likewise stay comic-id-scoped.
        const filterInput = canvas.getByPlaceholderText('Filter non-present')
        await userEvent.type(filterInput, 'Claire')

        const addClaireButton = await waitFor(() =>
            canvas.getByTitle('Add Claire to comic')
        )
        await userEvent.click(addClaireButton)

        await expect(store.getState().comic.current).toEqual(0)
    },
}

export const SaveDisabledUntilChanged: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(
            await canvas.findByText(
                `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
            )
        )

        const saveButton = await waitFor(() =>
            canvas.getByRole('button', { name: 'Save changes' })
        )

        // Nothing has been edited yet, so there's nothing to save.
        await expect(saveButton).toBeDisabled()

        const titleInput = canvas.getByLabelText('Title')
        await userEvent.type(titleInput, ' (edited)')

        await waitFor(() => expect(saveButton).toBeEnabled())

        // Reverting the edit back to the original value means the form is
        // clean again, so saving should be disabled once more.
        await userEvent.clear(titleInput)
        await userEvent.type(titleInput, PENDING_COMIC.title)

        await waitFor(() => expect(saveButton).toBeDisabled())
    },
}

export const DirtyFieldsAreMarked: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(
            await canvas.findByText(
                `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
            )
        )

        await waitFor(() =>
            expect(canvas.getByText('Title')).toBeInTheDocument()
        )

        // Untouched fields show their plain label, with no trailing marker.
        await expect(canvas.getByText('Title')).not.toHaveClass('italic')
        await expect(canvas.queryByText('Title*')).not.toBeInTheDocument()

        const titleInput = canvas.getByLabelText('Title')
        await userEvent.type(titleInput, ' (edited)')

        // Once edited, the label switches to the dirty presentation: italic
        // text with a trailing `*`, matching the regular comic editor.
        await waitFor(() =>
            expect(canvas.getByText('Title*')).toHaveClass('italic')
        )

        const guestComicLabel = canvas.getByText('Guest comic')
        await expect(guestComicLabel).not.toHaveClass('italic')

        await userEvent.click(canvas.getByLabelText('Guest comic'))

        await waitFor(() =>
            expect(canvas.getByText('Guest comic*')).toHaveClass('italic')
        )
    },
}

export const SaveOnlySendsChangedFields: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(
            await canvas.findByText(
                `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
            )
        )

        await waitFor(() =>
            expect(
                canvas.getByRole('button', { name: 'Save changes' })
            ).toBeInTheDocument()
        )

        let patchedBody: unknown
        getWorker().use(
            http.patch(
                'http://localhost:3000/api/v3/comicdata/:comicId',
                async ({ request }) => {
                    patchedBody = await request.json()
                    return HttpResponse.text('"Comic updated"')
                }
            )
        )

        // Only the title is touched; every other field is left as loaded.
        // The patch request should therefore only carry `title` — sending
        // unmodified fields would make the backend log spurious "changed
        // from X to X" entries for every one of them.
        const titleInput = canvas.getByLabelText('Title')
        await userEvent.clear(titleInput)
        await userEvent.type(titleInput, 'An edited title')

        await userEvent.click(
            canvas.getByRole('button', { name: 'Save changes' })
        )

        await waitFor(() =>
            expect(patchedBody).toEqual({ title: 'An edited title' })
        )
    },
}

export const SaveFails: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get(
                    'http://localhost:3000/api/v3/comicdata/advance',
                    () => {
                        return HttpResponse.json([
                            {
                                comic: PENDING_COMIC.comic,
                                title: PENDING_COMIC.title,
                                tagline: PENDING_COMIC.tagline,
                                publishDate: PENDING_COMIC.publishDate,
                            },
                        ])
                    }
                ),
                http.get(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    ({ params }) => {
                        const { comicId } = params
                        if (Number(comicId) === PENDING_COMIC.comic) {
                            return HttpResponse.json({
                                ...PENDING_COMIC,
                                allItems: ALL_ITEMS.map((item) => ({
                                    id: item.id,
                                    first: item.id,
                                    previous: null,
                                    next: null,
                                    last: item.id,
                                })),
                            })
                        }
                        return HttpResponse.json({
                            comic: Number(comicId),
                            editorData: { present: false },
                            hasData: false,
                        })
                    }
                ),
                http.get('http://localhost:3000/api/v3/itemdata/', () => {
                    return HttpResponse.json(ALL_ITEMS)
                }),
                http.patch(
                    'http://localhost:3000/api/v3/comicdata/:comicId',
                    async () => {
                        await mockNetworkDelay(500)
                        return HttpResponse.text('Server Error', {
                            status: 500,
                        })
                    }
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(
            await canvas.findByText(
                `#${PENDING_COMIC.comic} — ${PENDING_COMIC.title}`
            )
        )

        await waitFor(() =>
            expect(
                canvas.getByRole('button', { name: 'Save changes' })
            ).toBeInTheDocument()
        )

        // Save changes is disabled until something is actually edited.
        await userEvent.type(canvas.getByLabelText('Title'), ' (edited)')

        await withSuppressedExpectedErrorAsync(
            'Got unexpected response from server',
            async () => {
                await userEvent.click(
                    canvas.getByRole('button', { name: 'Save changes' })
                )

                await waitFor(() =>
                    expect(
                        canvas.getByText(
                            'Failed to save changes. See notification for details.'
                        )
                    ).toBeInTheDocument()
                )
            }
        )

        // A failed save must stay on the edit screen rather than going back.
        await expect(
            canvas.getByText(`Edit advance comic #${PENDING_COMIC.comic}`)
        ).toBeInTheDocument()
    },
}
