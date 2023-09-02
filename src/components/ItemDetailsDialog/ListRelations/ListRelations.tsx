import { RelatedItem } from '@models/RelatedItem'
import { useAllItemsQuery } from '@store/api/itemApiSlice'

import { error } from '~/utils'

export default function ListRelations({
    itemRelationData,
    editMode,
    totalComics,
    onShowInfoFor,
}: {
    itemRelationData: RelatedItem[]
    editMode: boolean
    totalComics: number
    onShowInfoFor: (id: number) => void
}) {
    const { data: itemData, isLoading: isLoadingAllItems } = useAllItemsQuery()

    if (isLoadingAllItems) {
        return <></>
    } else if (itemRelationData.length > 0 && itemData) {
        const output: JSX.Element[] = []
        for (const relation of itemRelationData) {
            const item = itemData.find((i) => i.id === relation.id)
            if (!item) {
                error('Item present in relation data but not item data!')
                continue
            }
            output.push(
                <li key={relation.id}>
                    <button
                        className="text-qc-link hover:underline"
                        onClick={() => onShowInfoFor(relation.id)}
                    >
                        {item.shortName}
                    </button>{' '}
                    {editMode ? (
                        <span>
                            (
                            <i
                                className="fa fa-id-card"
                                aria-hidden="true"
                                title="Item ID"
                            ></i>{' '}
                            {relation.id})
                        </span>
                    ) : (
                        <></>
                    )}{' '}
                    in {relation.count} comics (
                    {Math.round((relation.count * 1000) / totalComics) / 10}%)
                </li>
            )
        }

        return <ul>{output}</ul>
    } else {
        return (
            <ul>
                <li>None</li>
            </ul>
        )
    }
}
