export type ImageFormat = 'auto' | 'jpg' | 'png' | 'webp' | 'avif' | 'gif'

export type ImageStyle = {
  id: string
  w: number
  h: number
  m: 'lfit' | 'mfit' | 'fill'
  f: ImageFormat
}

const SIZE_HIT_TOLERANCE = 0.2

/**
 * 因为不知道原图实际的比例
 *
 * 在 cover 模式下，使用 lfit 或者 mfit 的时候
 *
 * 只能假设，原图的比例和容器的比例接近
 */
export class PickPic {
  private styles: ImageStyle[]
  private fallbackStyles: Record<string, string>
  private lfits: ImageStyle[]
  private mfits: ImageStyle[]
  private fills: ImageStyle[]
  private enableCache: boolean
  // TODO: 优化
  private cache: Map<string, { s: ImageStyle; update: number }> = new Map()

  constructor(opts: {
    styles: ImageStyle[]
    fallbackStyles: Record<string, string>
    enableCache: boolean
  }) {
    this.styles = opts.styles
    this.fallbackStyles = opts.fallbackStyles
    this.lfits = this.styles.filter((style) => style.m === 'lfit')
    this.mfits = this.styles.filter((style) => style.m === 'mfit')
    this.fills = this.styles
      .filter((style) => style.m === 'fill')
      .sort((a, b) => (a.w * a.h < b.w * b.h ? -1 : 1))
    this.enableCache = opts.enableCache
  }

  private getFallbackStyle(format: string) {
    const name = this.fallbackStyles[format]
      ? this.fallbackStyles[format]
      : this.fallbackStyles['default']
    return this.styles.find((s) => s.id === name)
  }

  private findFits(opts: {
    width: number
    height: number
    format: ImageFormat
    fit: 'cover' | 'contain'
  }): ImageStyle {
    const { width, height, format, fit } = opts

    const results: { width: number; height: number; style: ImageStyle }[] = []
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
        Math.abs(ret.width - width) / width < SIZE_HIT_TOLERANCE ||
        ret.width > width,
    )
    if (fit === 'contain') {
      const fitStyleWithAspect = highPriorities.find(
        (s) =>
          s.style.h > 0 &&
          s.style.w / s.style.h <= width / height &&
          Math.abs(s.style.w - width) / s.style.w < SIZE_HIT_TOLERANCE,
      )
      const fitStyleWithoutAspect = highPriorities.find(
        (s) =>
          s.style.h === 0 &&
          Math.abs(s.style.w - width) / s.style.w < SIZE_HIT_TOLERANCE,
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
    format: ImageFormat
  }) {
    const k = `${opts.fit ?? 'cover'}_w${opts.width ?? 0}_h${opts.height ?? 0}_${opts.format}`

    if (this.enableCache) {
      if (this.cache.get(k)) {
        this.cache.get(k).update = Date.now()
        return this.cache.get(k).s
      }
    }

    const style = this.getStyleImpl(opts)

    if (this.enableCache) {
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
    format: ImageFormat
  }): ImageStyle | undefined {
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
          .filter((s) => s.f === format)
          .sort((a, b) => (a.w < b.w ? -1 : 1))
        const style = ordered.find(
          (s) =>
            Math.abs(s.w - width) / s.w < SIZE_HIT_TOLERANCE || s.w > width,
        )
        if (style) {
          return style
        }
        return ordered[ordered.length - 1] ?? this.getFallbackStyle(format)
      } else if (height) {
        const ordered = [...this.lfits]
          .filter((s) => s.f === format)
          .sort((a, b) => (a.h < b.h ? -1 : 1))
        const style = ordered.find(
          (s) =>
            Math.abs(s.h - height) / s.h < SIZE_HIT_TOLERANCE || s.h > height,
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
          Math.abs(style.w - width) / style.w < SIZE_HIT_TOLERANCE ||
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
}
