import { HttpResponse, delay, http } from 'msw'

import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { apiSlice } from '@store/apiSlice'
import { setCurrentComic } from '@store/comicSlice'
import { setShowCopyItemsDialog } from '@store/dialogSlice'
import store from '@store/store'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ALL_ITEMS, COMIC_DATA_666, getComicListMocks } from '~/mocks'

import CopyItemsDialog from './CopyItemsDialog'

const meta: Meta<typeof CopyItemsDialog> = {
    component: CopyItemsDialog,
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
                        // We pretend this takes 1-2 seconds so we get to
                        // observe the loading UX
                        await delay(1000 + Math.random() * 1000)
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
                http.get('http://localhost:3000/api/v3/comicdata/', () => {
                    return HttpResponse.json(getComicListMocks(1000))
                }),
                http.post(
                    'http://localhost:3000/api/v3/comicdata/additems',
                    async () => {
                        // We pretend this takes 1-2 seconds so we get to
                        // observe the loading UX
                        await delay(1000 + Math.random() * 1000)
                        return HttpResponse.text('Items added to comic')
                    }
                ),
            ],
        },
    },
    loaders: [
        () => {
            store.dispatch(apiSlice.util.resetApiState())

            const state = store.getState()
            if (!state.dialog.showCopyItemsDialogFor) {
                store.dispatch(setShowCopyItemsDialog(666))
            }
            if (state.comic.current !== 667) {
                store.dispatch(setCurrentComic(667))
            }
        },
    ],
}
export default meta

type Story = StoryObj<typeof CopyItemsDialog>

export const Default: Story = {}
