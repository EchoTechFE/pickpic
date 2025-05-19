import { singletonPickPicInstance, findAspect } from '../pick'
import { IThumbnailSize } from '../types'

/**
 * 找到一个图片规格，图片规格尽量与传入的尺寸匹配，在不完全匹配的情况下，选取图片质量更好的图片规格
 * @param {*} size
 * @param {*} widthFirst 会进行两遍寻找，在两次寻找都没有找到合适的图时，是否启用宽度优先模式匹配
 */

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
    return item.url
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
      systemInfo = {
        windowWidth: 375,
        windowHeight: 667,
        pixelRatio: 2,
        statusBarHeight: 20,
        platform: 'devtools',
        system: 'devtools',
      }

      return systemInfo
    }
  }
})()
