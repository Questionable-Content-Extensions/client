import { ImageType } from '@models/ImageType'

export type KnownImageType = Exclude<ImageType, 'unknown'>
