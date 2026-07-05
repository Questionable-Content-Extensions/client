import { useEffect, useMemo, useState } from 'react'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'

import { ComicId } from '@models/ComicId'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMIC_DATA_666_HYDRATED_ITEMS, getComicListMocks } from '~/mocks'

import CopyItemsDialogPanel from './CopyItemsDialogPanel'

const meta: Meta<typeof CopyItemsDialogPanel> = {
    component: CopyItemsDialogPanel,
    argTypes: {
        selectedItems: {
            table: {
                disable: true,
            },
        },
        onUpdateSelectedItems: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        allComics: getComicListMocks(5000),
        selectedComic: 665,
        isLoading: false,
        isFetching: false,
        comicItems: COMIC_DATA_666_HYDRATED_ITEMS,
        onChangeSelectedComic: fn(),
        onUpdateSelectedItems: fn(),
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        const onChangeSelectedComic = (selectedComic: ComicId) => {
            setArgs({ selectedComic })
            args.onChangeSelectedComic(selectedComic)
        }

        const reverseAllComics = useMemo(() => {
            if (args.allComics) {
                const reverseAllComics = [...args.allComics]
                reverseAllComics.reverse()
                return reverseAllComics
            }
        }, [args.allComics])

        const [selectedItems, setSelectedItems] = useState<{
            [id: number]: boolean
        }>({})
        useEffect(() => {
            const selectedItems: { [id: number]: boolean } = {}
            if (args.comicItems) {
                for (const item of args.comicItems) {
                    selectedItems[item.id] = true
                }
                setSelectedItems(selectedItems)
            }
        }, [args.comicItems])

        return (
            <CopyItemsDialogPanel
                {...args}
                allComics={reverseAllComics}
                onChangeSelectedComic={onChangeSelectedComic}
                selectedItems={selectedItems}
                onUpdateSelectedItems={(s) => {
                    setSelectedItems(s)
                    args.onUpdateSelectedItems(s)
                }}
            />
        )
    },
}
export default meta

type Story = StoryObj<typeof CopyItemsDialogPanel>

export const Default: Story = {}

export const IsLoading: Story = {
    args: {
        allComics: undefined,
        isLoading: true,
    },
}

export const IsFetching: Story = {
    args: {
        isFetching: true,
    },
}
