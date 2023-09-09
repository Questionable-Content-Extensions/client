// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PublishDatePatch } from './PublishDatePatch'
import type { Token } from './Token'

export interface PatchComicBody {
    token: Token
    publishDate?: PublishDatePatch
    title?: string
    tagline?: string
    isGuestComic?: boolean
    isNonCanon?: boolean
    hasNoCast?: boolean
    hasNoLocation?: boolean
    hasNoStoryline?: boolean
    hasNoTitle?: boolean
    hasNoTagline?: boolean
}
