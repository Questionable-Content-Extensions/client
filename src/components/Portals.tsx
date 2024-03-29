import ChangeLogDialogPortal from './ChangeLogDialog/ChangeLogDialogPortal/ChangeLogDialogPortal'
import CopyItemsDialogPortal from './CopyItemsDialog/CopyItemsDialogPortal/CopyItemsDialogPortal'
import EditLogDialogPortal from './EditLogDialog/EditLogDialogPortal'
import GoToComicDialogPortal from './GoToComicDialog/GoToComicDialogPortal'
import ItemDetailsDialogPortal from './ItemDetailsDialog/ItemDetailsDialogPortal/ItemDetailsDialogPortal'
import SettingsDialogPortal from './SettingsDialog/SettingDialogPortal/SettingsDialogPortal'

export default function Portals() {
    return (
        <>
            <ChangeLogDialogPortal />
            <CopyItemsDialogPortal />
            <EditLogDialogPortal />
            <GoToComicDialogPortal />
            <ItemDetailsDialogPortal />
            <SettingsDialogPortal />
        </>
    )
}
