import { RelatedItem } from '@models/RelatedItem'

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
    if (itemRelationData.length > 0) {
        const output: JSX.Element[] = []
        for (const relation of itemRelationData) {
            output.push(
                <li key={relation.id}>
                    <button
                        className="text-qc-link hover:underline"
                        onClick={() => onShowInfoFor(relation.id)}
                    >
                        {relation.shortName}
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
