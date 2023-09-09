declare var cloneInto: any
declare var exportFunction: (
    func: Function,
    targetScope: object,
    options?: {
        defineAs?: string
        allowCallbacks?: boolean
        allowCrossOriginArguments?: boolean
    }
) => Function
declare var createObjectIn: <T>(
    obj: object,
    options?: { defineAs?: string }
) => T
