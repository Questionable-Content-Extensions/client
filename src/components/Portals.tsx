import GoToComicDialogPortal from './GoToComicDialog/GoToComicDialogPortal'
import ItemDetailsDialogPortal from './ItemDetailsDialog/ItemDetailsDialogPortal/ItemDetailsDialogPortal'
import SettingsDialogPortal from './SettingsDialog/SettingDialogPortal/SettingsDialogPortal'

export default function Portals() {
    return (
        <>
            <GoToComicDialogPortal />
            <SettingsDialogPortal />
            <ItemDetailsDialogPortal />
        </>
    )
}
