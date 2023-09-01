import { ComicId } from '@models/ComicId'
import { useArgs, useEffect, useMemo, useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { COMIC_DATA_666_HYDRATED_ITEMS, getComicListMocks } from '~/mocks'

import CopyItemsDialogPanel from './CopyItemsDialogPanel'

export default {
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
} as ComponentMeta<typeof CopyItemsDialogPanel>

const Template: ComponentStory<typeof CopyItemsDialogPanel> = (args) => {
    let [_args, setArgs] = useArgs()
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
        let selectedItems: { [id: number]: boolean } = {}
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
}

export const Default = Template.bind({})
Default.args = {
    allComics: getComicListMocks(5000),
    selectedComic: 665,
    isLoading: false,
    isFetching: false,
    comicItems: COMIC_DATA_666_HYDRATED_ITEMS,
}

export const IsLoading = Template.bind({})
IsLoading.args = {
    ...Default.args,
    allComics: undefined,
    isLoading: true,
}

export const IsFetching = Template.bind({})
IsFetching.args = {
    ...Default.args,
    isFetching: true,
}
