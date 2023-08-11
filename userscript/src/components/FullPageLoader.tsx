import Spinner from './Spinner'

export default function FullPageLoader({
    loadingText,
    show,
    height,
    width,
}: {
    loadingText: string
    show: boolean
    height: string
    width: string
}) {
    if (show) {
        return (
            <div className="text-center absolute left-0 top-0 right-0 bottom-0">
                <div
                    role="status"
                    className="h-full w-full bg-black bg-opacity-50"
                >
                    <div className="pt-20">
                        <Spinner
                            loadingText={loadingText}
                            height={height}
                            width={width}
                            textColor="text-gray-100"
                            spinnerColor="fill-blue-400"
                            spinnerBgColor="text-gray-100"
                        />
                    </div>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}
