import { IThumbnailSize } from '../types'
import { singletonPickPicInstance } from './index'
import { FORMAT_PATTERN } from '../config/constants'
import { size2Num } from '../utils/url'

export function findAspect(
  size: IThumbnailSize,
  { widthFirst = false, mode = 'aspectFit' } = {},
) {
  const fit = mode === 'aspectFit' ? 'contain' : 'cover'

  size = size2Num(size)

  if (!singletonPickPicInstance) {
    throw new Error('singletonPickPicInstance is not init')
  }

  const style = singletonPickPicInstance.getStyle({
    width: +size.width,
    height: +(widthFirst ? 0 : size.height),
    fit,
    format: FORMAT_PATTERN.AUTO,
  })

  return style
}
