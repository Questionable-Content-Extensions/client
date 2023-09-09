import { ToastContent, toast } from 'react-toastify'

import { MutationLifecycleApi } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default async function toastSuccess<
    Arg,
    Data extends ToastContent<unknown>,
>(_arg: Arg, api: MutationLifecycleApi<Arg, any, Data, string>) {
    try {
        const result = await api.queryFulfilled
        toast.success(result.data)
    } catch {}
}
