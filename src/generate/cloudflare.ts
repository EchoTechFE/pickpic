import { CustomURL, getSizeWithResizeParams } from '../utils/url'
import {
  FORMAT_PATTERN,
  BUILDER_PROVIDER_MAP,
  CLOUDFLARE_BUILDER_SIGN,
  CLOUDFLARE_RESIZE_MODE,
  RESIZE_MODE_CLOUDFLARE_RESIZE_MODE_RELATION,
  RESIZE_MODE,
} from '../config/constants'
import { singletonPickPicInstance } from '../pick'
import { IUrlProcessBuilder } from './base'

const { PATH_PREFIX, PATH_SPLITER, PARAMS_SPLITER, PARAMS_CONNECTOR } =
  CLOUDFLARE_BUILDER_SIGN

interface IUrlProcessBuilderConfig {}

interface IParseMeta {
  width: number
  height: number
}

export interface IURLBuildParams {
  fit?: string
  w?: string
  h?: string
  f?: string
  q?: string
}

export class CloudflareUrlProcessBuilder implements IUrlProcessBuilder {
  static provider = BUILDER_PROVIDER_MAP.CLOUDFLARE

  rawUrl: string

  parseMeta: IParseMeta | null = null

  params: IURLBuildParams = {}

  constructor(url: string, config?: IUrlProcessBuilderConfig) {
    if (singletonPickPicInstance?.config.decodeFunc) {
      url = singletonPickPicInstance?.config.decodeFunc(url)
    }

    this.rawUrl = url

    this.params = {
      q: '80',
    }
  }

  mode(mode: RESIZE_MODE) {
    const adaptMode =
      RESIZE_MODE_CLOUDFLARE_RESIZE_MODE_RELATION[mode] ||
      CLOUDFLARE_RESIZE_MODE.CONTAIN

    this.params.fit = adaptMode
    return this
  }

  resize(pattern: string) {
    const { width, height } = getSizeWithResizeParams(pattern)

    if (width) {
      this.params.w = String(width)
    }

    if (height) {
      this.params.h = String(height)
    }

    return this
  }

  format(pattern: FORMAT_PATTERN) {
    this.params.f = pattern
    return this
  }

  rotate(degree: number) {
    return this
  }

  watermark() {
    return this
  }

  origin() {
    return this
  }

  snapshot() {
    return this
  }

  styleName(style: string) {
    return this
  }

  color() {
    return this
  }

  info() {
    return this
  }

  // 通过 url 中的宽高信息来解析
  parse(): IParseMeta {
    if (this.parseMeta) {
      return this.parseMeta
    }

    return {
      width: 0,
      height: 0,
    }
  }

  async parseAsync(): Promise<IParseMeta> {
    return Promise.resolve({
      width: 0,
      height: 0,
    })
  }

  build(): string {
    const urlStruct = new CustomURL(this.rawUrl)
    const searchParams = urlStruct.searchParams

    // 自动删除图片元信息
    if (searchParams.get('imginfo')) {
      searchParams.delete('imginfo')
    }

    const paramEntryList = Object.entries(this.params)

    const paramList = paramEntryList.map(([field, value]) => {
      return `${field}${PARAMS_CONNECTOR}${value}`
    })

    const paramString = paramList.join(PARAMS_SPLITER)

    const pathnameParamList = [PATH_PREFIX, paramString]

    urlStruct.pathname =
      pathnameParamList.join(PATH_SPLITER) + urlStruct.pathname

    return urlStruct.toString()
  }
}
