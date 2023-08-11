export interface Singletons {
    startComic: number
    latestComic: number
    currentComic: number
}

export function initialize(initializer: Singletons) {
    singletons = initializer
}

export function get(): Singletons {
    return singletons as Singletons
}

let singletons: Singletons | null = null
