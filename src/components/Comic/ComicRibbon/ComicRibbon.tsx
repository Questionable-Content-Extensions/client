import styles from './ComicRibbon.module.css'

export enum RibbonType {
    None,
    GuestComic,
    NonCanon,
}

export default function ComicRibbon({
    ribbonType,
    show,
}: {
    ribbonType: RibbonType
    show: boolean
}) {
    if (show && ribbonType !== RibbonType.None) {
        let ribbonText
        let ribbonStyle
        if (ribbonType === RibbonType.GuestComic) {
            ribbonText = 'Guest comic'
            ribbonStyle = styles.guestComic
        } else {
            ribbonText = 'Non-canon'
            ribbonStyle = styles.nonCanon
        }
        return (
            <div className={`${styles.ribbon} ${ribbonStyle}`}>
                <span>{ribbonText}</span>
            </div>
        )
    } else {
        return <></>
    }
}
