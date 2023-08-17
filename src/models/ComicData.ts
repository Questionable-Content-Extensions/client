import { ItemBaseDataWithColor } from './ItemData'

export type ComicDataListing = {
    comic: number
    title: string | null
    isGuestComic: boolean
    isNonCanon: boolean
}

export type ComicDataShared = {
    comic: number
    editorData: EditorData
    allItems?: ItemNavigationData[]
}

export type ComicDataPresent = {
    // discriminant in `ComicData`
    hasData: true

    imageType: ImageType | null
    publishDate: string | null
    isAccuratePublishDate: boolean
    title: string | null
    tagline: string | null
    isGuestComic: boolean
    isNonCanon: boolean
    hasNoCast: boolean
    hasNoLocation: boolean
    hasNoStoryline: boolean
    hasNoTitle: boolean
    hasNoTagline: boolean
    news: string | null
    previous: number | null
    next: number | null
    items: ItemNavigationData[]
}

export type ComicDataMissing = {
    // discriminant in `ComicData`
    hasData: false

    previous?: number
    next?: number
}

export type ComicData = ComicDataShared & (ComicDataPresent | ComicDataMissing)

export type EditorDataMissing = {
    present: false
}

export type EditorDataPresent = {
    present: true
    missing: MissingNavigationData
}

export type EditorData = EditorDataMissing | EditorDataPresent

export type MissingNavigationData = {
    cast: NavigationData
    location: NavigationData
    storyline: NavigationData
    title: NavigationData
    tagline: NavigationData
}

export type NavigationData = {
    first: number | null
    previous: number | null
    next: number | null
    last: number | null
}

export type ItemNavigationData = ItemBaseDataWithColor & {
    first: number | null
    previous: number | null
    next: number | null
    last: number | null
    count: number
}

export type ImageType = 'unknown' | 'png' | 'gif' | 'jpeg'
export type KnownImageType = Exclude<ImageType, 'unknown'>
