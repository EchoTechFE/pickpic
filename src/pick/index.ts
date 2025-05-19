import { IImageStyle, IPickPicConfig } from '../types'
import { defaultPickPicConfig } from '../config/default'
import { FORMAT_PATTERN, RESIZE_MODE } from '../config/constants'
import { getSizeWithResizeParams } from '../utils/url'
export * from './find'

let singletonPickPicInstance: PickPic | null = null

export function init(pickPicConfig?: Partial<IPickPicConfig>) {
  if (singletonPickPicInstance) return

  const mergeConfig = {
    ...defaultPickPicConfig,
    ...pickPicConfig,
  }

  const resizePatternValue = Object.values(mergeConfig.resizePattern)
  const resizeModeValue = Object.values(mergeConfig.resizeMode)

  const styles = resizePatternValue.flatMap((p) => {
    const { width: w, height: h } = getSizeWithResizeParams(p)

    const currentList: IImageStyle[] = []

    for (const mode of resizeModeValue) {
      const id = `${mode}${w ? '_w' + w : ''}${h ? '_h' + h : ''}`

      currentList.push({
        id,
        w,
        h,
        f: FORMAT_PATTERN.AUTO,
        m: mode,
      })
    }

    return currentList
  })

  singletonPickPicInstance = new PickPic(styles, mergeConfig)
}

/**
 * 因为不知道原图实际的比例
 *
 * 在 cover 模式下，使用 lfit 或者 mfit 的时候
 *
 * 只能假设，原图的比例和容器的比例接近
 */
export class PickPic {
  config: IPickPicConfig

  private styles: IImageStyle[]
  private lfits: IImageStyle[]
  private mfits: IImageStyle[]
  private fills: IImageStyle[]
  // TODO: 优化
  private cache: Map<string, { s: IImageStyle; update: number }> = new Map()

  constructor(styles: IImageStyle[], config: IPickPicConfig) {
    this.styles = styles

    this.config = config

    this.lfits = this.styles.filter((style) => style.m === RESIZE_MODE.LFIT)
    this.mfits = []
    this.fills = this.styles
      .filter((style) => style.m === RESIZE_MODE.FILL)
      .sort((a, b) => (a.w * a.h < b.w * b.h ? -1 : 1))
  }

  private getFallbackStyle(format: string) {
    const { fallbackStyles } = this.config

    const name = fallbackStyles[format]
      ? fallbackStyles[format]
      : fallbackStyles['default']
    return this.styles.find((s) => s.id === name)
  }

  private findFits(opts: {
    width: number
    height: number
    format: FORMAT_PATTERN
    fit: 'cover' | 'contain'
  }): IImageStyle {
    const { width, height, format, fit } = opts

    const results: { width: number; height: number; style: IImageStyle }[] = []
    if (fit === 'cover') {
      this.mfits
        .filter((s) => s.f === format)
        .forEach((style) => {
          if (width / height > style.w / style.h) {
            results.push({
              width: (style.h / height) * width,
              height: style.h,
              style,
            })
          } else {
            results.push({
              width: style.w,
              height: (style.w / width) * height,
              style,
            })
          }
        })
    }

    this.lfits
      .filter((s) => {
        if (fit === 'cover') {
          return s.f === format && s.h === 0
        }
        return s.f === format
      })
      .forEach((style) => {
        if (style.h === 0 || width / height > style.w / style.h) {
          results.push({
            width: style.w,
            height: (style.w / width) * height,
            style,
          })
        } else {
          results.push({
            width: (style.h / height) * width,
            height: style.h,
            style,
          })
        }
      })

    results.sort((a, b) => (a.width < b.width ? -1 : 1))
    const highPriorities = results.filter(
      (ret) =>
        Math.abs(ret.width - width) / width < this.config.sizeHitTolerance ||
        ret.width > width,
    )
    if (fit === 'contain') {
      const fitStyleWithAspect = highPriorities.find(
        (s) =>
          s.style.h > 0 &&
          s.style.w / s.style.h <= width / height &&
          Math.abs(s.style.w - width) / s.style.w <
            this.config.sizeHitTolerance,
      )
      const fitStyleWithoutAspect = highPriorities.find(
        (s) =>
          s.style.h === 0 &&
          Math.abs(s.style.w - width) / s.style.w <
            this.config.sizeHitTolerance,
      )

      if (fitStyleWithAspect) {
        return fitStyleWithAspect.style
      }
      if (fitStyleWithoutAspect) {
        return fitStyleWithoutAspect.style
      }
    }

    if (highPriorities.length > 0) {
      return highPriorities[0].style
    }
    return results[results.length - 1].style ?? this.getFallbackStyle(format)
  }

  getStyle(opts: {
    width?: number
    height?: number
    fit?: 'cover' | 'contain'
    format: FORMAT_PATTERN
  }): IImageStyle {
    opts.format = FORMAT_PATTERN.AUTO

    const k = `${opts.fit ?? 'cover'}_w${opts.width ?? 0}_h${opts.height ?? 0}_${opts.format}`

    if (this.config.enableCache) {
      if (this.cache.get(k)) {
        this.cache.get(k)!.update = Date.now()
        return this.cache.get(k)!.s
      }
    }

    const style = this.getStyleImpl(opts) || {
      id: '',
      w: 0,
      h: 0,
      m: '',
      f: FORMAT_PATTERN.AUTO,
    }

    if (this.config.enableCache && style?.id) {
      this.cache.set(k, { s: style, update: Date.now() })
      for (const [k, v] of this.cache.entries()) {
        if (Date.now() - v.update > 1000 * 20) {
          this.cache.delete(k)
        }
      }
    }

    return style
  }

  private getStyleImpl(opts: {
    width?: number
    height?: number
    fit?: 'cover' | 'contain'
    format: FORMAT_PATTERN
  }): IImageStyle | undefined {
    if (opts.format === 'gif') {
      return
    }

    const { width, height, format } = opts
    let { fit } = opts

    if (!fit) {
      fit = 'cover'
    }

    if (!width || !height) {
      if (width) {
        const ordered = [...this.lfits]
          .filter((s) => s.f === format && s.h === 0)
          .sort((a, b) => {
            if (a.w !== b.w) {
              return a.w - b.w
            }
            return a.h - b.h
          })
        const style = ordered.find(
          (s) =>
            Math.abs(s.w - width) / s.w < this.config.sizeHitTolerance ||
            s.w > width,
        )
        if (style) {
          return style
        }
        return ordered[ordered.length - 1] ?? this.getFallbackStyle(format)
      } else if (height) {
        const ordered = [...this.lfits]
          .filter((s) => s.f === format && s.w === 0)
          .sort((a, b) => {
            if (a.h !== b.h) {
              return a.h - b.h
            }
            return a.w - b.w
          })
        const style = ordered.find(
          (s) =>
            Math.abs(s.h - height) / s.h < this.config.sizeHitTolerance ||
            s.h > height,
        )
        if (style) {
          return style
        }
        return ordered[ordered.length - 1] ?? this.getFallbackStyle(format)
      } else {
        return this.getFallbackStyle(format)
      }
    }

    if (fit === 'cover') {
      const aspect = width / height
      const availables = this.fills.filter(
        (style) =>
          Math.abs(style.w / style.h - aspect) < 0.05 && style.f === format,
      )
      const hitStyle = availables.find(
        (style) =>
          Math.abs(style.w - width) / style.w < this.config.sizeHitTolerance ||
          style.w > width ||
          style.h > height,
      )
      if (hitStyle) {
        return hitStyle
      } else if (availables.length > 0) {
        return availables[availables.length - 1]
      }
    }

    return this.findFits({
      width,
      height,
      format: opts.format,
      fit,
    })
  }

  setRegion(region: string) {
    this.config.region = region
  }
}

export { singletonPickPicInstance }
