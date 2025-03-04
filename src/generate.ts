import { CustomURL } from './url'
import {
  RESIZE_MODE,
  RESIZE_PATTERN,
  SHORT_RULE,
  FORMAT_PATTERN,
  URL_BUILDER_SIGN,
} from './contants'

const { PARAM_SPLITER, WATERMARK_SIGN, ROTATE_SIGN, ORIGIN_SIGN } =
  URL_BUILDER_SIGN

interface IUrlProcessBuilderConfig {}

interface IURLBuildParams {
  mode?: RESIZE_MODE
  resize?: string
  format?: string
  rotate?: string
  origin?: string
  watermark?: string
  shortRule?: SHORT_RULE
}

interface IParseMeta {
  width: number
  height: number
}

/**
 * URL process builder for all image url
 * */
class UrlProcessBuilder {
  private rawUrl: string
  private urlStruct: CustomURL

  private parseMeta: IParseMeta

  private config: IUrlProcessBuilderConfig

  private params: IURLBuildParams = {
    mode: RESIZE_MODE.LFIT,
    resize: RESIZE_PATTERN.WIDTH_360_HEIGHT_360,
    format: FORMAT_PATTERN.AVIF,
  }

  constructor(config: IUrlProcessBuilderConfig) {
    this.config = config
  }

  Url(url: string) {
    this.rawUrl = url

    this.urlStruct = new CustomURL(this.rawUrl)

    return this
  }

  Mode(mode: RESIZE_MODE) {
    this.params.mode = mode
    return this
  }

  Resize(pattern: RESIZE_PATTERN) {
    this.params.resize = PARAM_SPLITER + pattern
    return this
  }

  Format(pattern: FORMAT_PATTERN) {
    this.params.format = PARAM_SPLITER + pattern
    return this
  }

  Rotate(degree: number) {
    if (degree < 0 || degree > 360) {
      throw new Error('degree should be in 0-360')
    }

    this.params.rotate = ROTATE_SIGN + PARAM_SPLITER + degree
    return this
  }

  Watermark() {
    this.params.watermark = this.AppendParamSpliterPrefix(WATERMARK_SIGN)
    return this
  }

  Origin() {
    this.params.origin = this.AppendParamSpliterPrefix(ORIGIN_SIGN)
    return this
  }

  ShortRule(shortRule: SHORT_RULE) {
    this.params.shortRule = shortRule
    return this
  }

  // 通过 url 中的宽高信息来解析
  Parse(): IParseMeta {
    if (this.parseMeta) {
      return this.parseMeta
    }

    const searchParams = this.urlStruct.searchParams

    const imginfo = searchParams.get('imginfo')

    if (imginfo) {
      const [_, width, __, height] = imginfo.match(/w(\d+)(,h(\d+))*/)

      this.parseMeta = {
        width: parseInt(width),
        height: parseInt(height),
      }

      return this.parseMeta
    }

    return {
      width: 0,
      height: 0,
    }
  }

  Build(): string {
    // 空 url | 非 http  的情况直接返回
    if (!this.urlStruct.protocol.includes('http')) {
      return this.rawUrl
    }

    const urlStruct = new CustomURL(this.rawUrl)
    const searchParams = urlStruct.searchParams

    // 携带签名 query 的情况直接返回
    if (searchParams.get('Expires')) {
      return this.rawUrl
    }

    // 自动删除图片元信息
    if (searchParams.get('imginfo')) {
      searchParams.delete('imginfo')
    }

    // 原图的场景直接返回
    if (this.params.origin) {
      return urlStruct.JoinPath(this.params.origin)
    }

    // 存在短规则的情况直接返回
    if (this.params.shortRule) {
      return urlStruct.JoinPath(this.params.shortRule)
    }

    // rotate 暂时仅支持单独使用
    if (this.params.rotate) {
      return urlStruct.JoinPath(this.params.rotate)
    }

    const paramsList = [
      this.params.mode,
      this.params.resize,
      this.params.format,
      this.params.watermark,
    ].filter((v) => v != null)

    return urlStruct.JoinPath(...paramsList)
  }

  private AppendParamSpliterPrefix(param: string): string {
    return PARAM_SPLITER + param
  }
}

export function NewUrlProcessBuilder(
  config?: IUrlProcessBuilderConfig,
): UrlProcessBuilder {
  return new UrlProcessBuilder(config)
}
