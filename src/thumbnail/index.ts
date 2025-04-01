import { singletonPickPicInstance } from '../pick'
import { isValidUrl } from '../utils/url'
import { FORMAT_PATTERN } from '../config/constants'
import { IThumbnailSize } from '../types'

function size2Num(size: IThumbnailSize) {
  let { width, height } = size

  const pixelRatio = Math.ceil(getSystemInfo().pixelRatio ?? 0)

  if (typeof width === 'string') {
    if (width && /rpx/.test(width)) {
      width = String(rpx2px(Number(width.replace(/rpx/, ''))))
    }
    if (width && /px/.test(width)) {
      width = Number(width.replace(/px/, ''))
    }
  }

  if (typeof height === 'string') {
    if (height && /rpx/.test(height)) {
      height = String(rpx2px(Number(height.replace(/rpx/, ''))))
    }
    if (height && /px/.test(height)) {
      height = Number(height.replace(/px/, ''))
    }
  }

  if (!width) width = 0
  if (!height) height = 0

  return {
    width: +width * pixelRatio,
    height: +height * pixelRatio,
  }
}

/**
 * 找到一个图片规格，图片规格尽量与传入的尺寸匹配，在不完全匹配的情况下，选取图片质量更好的图片规格
 * @param {*} size
 * @param {*} widthFirst 会进行两遍寻找，在两次寻找都没有找到合适的图时，是否启用宽度优先模式匹配
 */
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

export function getThumbnailQuery(
  size: IThumbnailSize,
  type = 'image',
  withFirst = false,
) {
  if (!singletonPickPicInstance) {
    throw new Error('singletonPickPicInstance is not init')
  }

  if (!size) {
    return '!lfit_w1080_jpg'
  }

  if (type === 'video') {
    return `!snapshot`
  }

  const target = findAspect(size, {
    widthFirst: withFirst,
    mode: size.mode,
  })

  const style = `!${target!.id}`

  return style
}

interface IPreviewImage {
  items: Array<{ url: string }>
  current: number
  size: IThumbnailSize
}

export function previewImage({ items = [], current = 0, size }: IPreviewImage) {
  const urls = items.map((item) => {
    const result = isValidUrl(item.url)
    const query = result ? getThumbnailQuery(size, 'image') : ''

    return `${item.url}${query}`
  })

  uni.previewImage({
    current: String(current),
    urls,
    indicator: 'number',
  })
}

export function rpx2px(num: number): number {
  const sysInfo = getSystemInfo()
  const radio = (sysInfo.windowWidth ?? 0) / 750

  return num * radio
}

export const getSystemInfo = (() => {
  let systemInfo: ReturnType<typeof uni.getSystemInfoSync> | null = null

  return ({ refreshCache } = { refreshCache: false }) => {
    if (systemInfo && !refreshCache) {
      return systemInfo
    }

    try {
      systemInfo = uni.getSystemInfoSync()

      return systemInfo
    } catch (err) {
      if (systemInfo) {
        return systemInfo
      }
      throw new Error('获取手机系统信息失败')
    }
  }
})()

export const isAndroid = (() => {
  let flag = false

  return () => {
    if (flag === null) {
      const { system = '' } = getSystemInfo()
      flag = /android/i.test(system)
    }

    return flag
  }
})()
