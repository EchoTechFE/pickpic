import { CustomURL } from '../utils/url'
import {
  RESIZE_MODE,
  RESIZE_PATTERN,
  SHORT_RULE,
  FORMAT_PATTERN,
  URL_BUILDER_SIGN,
  VideoExtList,
} from '../config/constants'
import { singletonPickPicInstance } from '../pick'

const { PARAM_SPLITER, WATERMARK_SIGN, ROTATE_SIGN, ORIGIN_SIGN } =
  URL_BUILDER_SIGN

interface IUrlProcessBuilderConfig {}

interface IURLBuildParams {
  mode?: string
  resize?: string
  format?: string
  rotate?: string
  origin?: string
  watermark?: string
  shortRule?: string
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

  private parseMeta: IParseMeta | null = null

  // private config: IUrlProcessBuilderConfig

  private params: IURLBuildParams = {}

  constructor(url: string, config?: IUrlProcessBuilderConfig) {
    // this.config = config

    this.rawUrl = url

    this.urlStruct = new CustomURL(this.rawUrl)
  }

  mode(mode: RESIZE_MODE) {
    this.params.mode = mode
    return this
  }

  resize(pattern: RESIZE_PATTERN) {
    this.params.resize = this.appendParamSpliterPrefix(pattern)
    return this
  }

  format(pattern: FORMAT_PATTERN) {
    this.params.format = this.appendParamSpliterPrefix(pattern)
    return this
  }

  rotate(degree: number) {
    if (degree < 0 || degree > 360) {
      throw new Error('degree should be in 0-360')
    }

    this.params.rotate = ROTATE_SIGN + PARAM_SPLITER + degree
    return this
  }

  watermark() {
    this.params.watermark = this.appendParamSpliterPrefix(WATERMARK_SIGN)
    return this
  }

  origin() {
    this.params.shortRule = this.appendParamSpliterPrefix(ORIGIN_SIGN)
    return this
  }

  snapshot() {
    this.params.shortRule = SHORT_RULE.SNAPSHOT
    return this
  }

  styleName(style: string) {
    this.params.shortRule = style
    return this
  }

  color() {
    this.params.shortRule = SHORT_RULE.COLOR
    return this
  }

  info() {
    this.params.shortRule = SHORT_RULE.INFO
    return this
  }

  // 通过 url 中的宽高信息来解析
  async parse(): IParseMeta {
    if (this.parseMeta) {
      return this.parseMeta
    }

    const searchParams = this.urlStruct.searchParams

    const imginfo = searchParams.get('imginfo')

    if (imginfo) {
      const [_, width, __, height] = imginfo.match(/w(\d+)(,h(\d+))*/) || []

      this.parseMeta = {
        width: parseInt(width),
        height: parseInt(height),
      }

      return this.parseMeta
    }

    if (!singletonPickPicInstance?.config?.queryEngine) {
      return {
        width: 0,
        height: 0,
      }
    }

    const tempInstance = newUrlProcessBuilder(this.rawUrl).info().build()

    const { data } =
      await singletonPickPicInstance?.config?.queryEngine?.get(tempInstance)

    return {
      width: data.ImageWidth?.value,
      height: data.ImageHeight?.value,
    }
  }

  build(): string {
    const urlStruct = new CustomURL(this.rawUrl)
    const searchParams = urlStruct.searchParams

    // 自动删除图片元信息
    if (searchParams.get('imginfo')) {
      searchParams.delete('imginfo')
    }

    // 如果是视频类型的话自动增加获取首帧截图
    for (const e of VideoExtList) {
      if (urlStruct.pathname.endsWith(e)) {
        this.snapshot()
      }
    }

    if (this.checkSkipUrlProcess(urlStruct)) return urlStruct.toString()

    // 存在短规则的情况直接返回
    if (this.params.shortRule) {
      return urlStruct.joinPath(this.params.shortRule)
    }

    // rotate 暂时仅支持单独使用
    if (this.params.rotate) {
      return urlStruct.joinPath(this.params.rotate)
    }

    const paramsList = [
      this.params.mode,
      this.params.resize,
      this.params.format,
      this.params.watermark,
    ].filter((v) => v !== undefined) as string[]

    return urlStruct.joinPath(...paramsList)
  }

  private checkSkipUrlProcess(urlStruct: CustomURL): boolean {
    const searchParams = urlStruct.searchParams

    if (!this.urlStruct.protocol.includes('http')) return true

    const excludePathList = ['tmp', 'im-images']
    const excludeQueryList = ['Expires', 'auth_key']
    const excludeExtendsList = ['gif', 'svg']

    for (const p of excludePathList) {
      if (urlStruct.pathname.includes(p)) return true
    }

    for (const q of excludeQueryList) {
      if (searchParams.get(q)) return true
    }

    for (const e of excludeExtendsList) {
      if (urlStruct.pathname.endsWith(e)) return true
    }

    return false
  }

  private appendParamSpliterPrefix(param: string): string {
    return PARAM_SPLITER + param
  }
}

export function newUrlProcessBuilder(url: string): UrlProcessBuilder {
  return new UrlProcessBuilder(url)
}
