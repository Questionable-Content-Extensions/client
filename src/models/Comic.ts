import { ComicData } from '@models/ComicData'
import { EditorData } from '@models/EditorData'
import { ItemNavigationData } from '@models/ItemNavigationData'

// We need this one because ts-rs doesn't support exporting this particular
// type.
export type Comic = {
    comic: number
    editorData: EditorData
    allItems?: Array<ItemNavigationData>
} & ComicData
