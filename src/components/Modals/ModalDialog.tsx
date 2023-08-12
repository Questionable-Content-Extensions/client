export default function ModalDialogSeat({
    header,
    body,
    footer,
}: {
    header: React.ReactChild
    body: React.ReactChild
    footer: React.ReactChild
}) {
    return (
        <dialog
            className={
                'p-0 border-none shadow-lg flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-[600px]'
            }
            aria-modal
        >
            <div className="flex flex-shrink-0 items-center justify-between p-4 border-0 border-b border-solid border-gray-200 rounded-t-md">
                {header}
                <button
                    type="button"
                    className="box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                    aria-label="Close"
                >
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div className="relative p-4">{body}</div>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                {footer}
            </div>
        </dialog>
    )
}
