import constants from '~/constants'

import ErrorPresenter from './ErrorPresenter'

export default function DebugLoadErrorPanel() {
    return (
        <div
            className={
                'bg-stone-100 border-solid border-0 border-b border-qc-header lg:border lg:border-stone-300 ' +
                'shadow-md lg:fixed lg:top-20 xl:top-48 lg:right-[50%] lg:-mr-[620px] lg:w-64 z-10 p-2 lg:max-h-[calc(100vh-5rem)] xl:max-h-[calc(100vh-12rem)] lg:overflow-y-auto'
            }
        >
            <h1 className="-mx-2 -mt-2 mb-0 text-center small-caps text-sm font-thin border-b border-solid border-b-stone-300 border-l-0 border-t-0 border-r-0">
                Questionable Content Extensions
                <br />
                <span
                    className="text-xs text-red-600"
                    title={`Server endpoint is ${constants.webserviceBaseUrl}`}
                >
                    (Development Mode)
                </span>
            </h1>
            <ErrorPresenter error={{ isDebugError: true }} />
        </div>
    )
}
