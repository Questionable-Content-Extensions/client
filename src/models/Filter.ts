import { ItemList } from '@models/ItemList'

export enum FilterType {
    Text,
    Item,
    IsGuestComic,
    IsNonCanon,
}

export type Filter =
    | {
          type: FilterType.Text
          value: string
      }
    | {
          type: FilterType.Item
          value: ItemList
      }
    | {
          type: FilterType.IsGuestComic | FilterType.IsNonCanon
          value: boolean
      }
