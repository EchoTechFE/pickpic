import { URL_BUILDER_SIGN, WidthHeightReg } from '../config/constants'
import { IThumbnailSize } from '../types'
import { getSystemInfo, rpx2px } from '../thumbnail'

const { URL_SPLITER } = URL_BUILDER_SIGN

export class CustomURL {
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  search: string
  searchParams: Map<string, string>
  hash: string

  constructor(url: string) {
    // 正则表达式用于匹配 URL 的各个部分
    const urlPattern =
      /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
    const matches = url.match(urlPattern) || []

    // 协议部分
    this.protocol = matches[2] ? matches[2] + ':' : ''
    // 主机部分，包含主机名和端口
    const hostPart = matches[4] || ''
    const hostPort = hostPart.split(':')
    this.host = hostPart
    this.hostname = hostPort[0]
    this.port = hostPort[1] || ''
    // 路径部分
    this.pathname = matches[5] || ''
    // 查询字符串部分
    this.search = matches[6] || ''
    // 查询参数对象
    this.searchParams = this.parseSearchParams(this.search)
    // 哈希部分
    this.hash = matches[8] ? '#' + matches[8] : ''
  }

  // 解析查询字符串为对象
  parseSearchParams(search: string) {
    const params = new Map()
    if (search) {
      const query = search.slice(1)
      const pairs = query.split('&')
      for (const pair of pairs) {
        const [key, value] = pair.split('=')
        params.set(decodeURIComponent(key), decodeURIComponent(value))
      }
    }
    return params
  }

  // 将查询参数对象转换为查询字符串
  serializeSearchParams() {
    const paramsArray = []
    for (const [key, value] of this.searchParams) {
      paramsArray.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
      )
    }
    return paramsArray.length > 0 ? '?' + paramsArray.join('&') : ''
  }

  // 获取完整的 URL 字符串
  toString() {
    let url = this.protocol
    if (this.host) {
      url += '//' + this.host
    }
    url += this.pathname
    url += this.serializeSearchParams()
    url += this.hash
    return url
  }

  joinPath(...params: string[]) {
    if (params.length === 0) {
      return this.toString()
    }

    return this.toString() + URL_SPLITER + params.join('')
  }
}

export function isValidUrl(url: string) {
  if (url.length === 0) return false

  const parsedUrl = url.trim()

  const excludePath = ['Expires', 'tmp', 'im-images', 'auth_key']

  for (let p of excludePath) {
    if (parsedUrl.includes(p)) return false
  }

  if (/(cdn\.(echoing|imagefield|qiandaoapp)|\.qiandaocdn)/.test(url))
    return true

  return false
}

export function getSizeWithResizeParams(resize: string): {
  width: number
  height: number
} {
  const matchList = WidthHeightReg.exec(resize)

  if (!matchList) return { width: 0, height: 0 }

  let w = 0
  let h = 0

  if (matchList[2]) {
    w = Number(matchList[2])
  } else if (matchList[3]) {
    h = Number(matchList[3])
  } else if (matchList[4] && matchList[5]) {
    w = Number(matchList[4])
    h = Number(matchList[5])
  }

  return {
    width: w,
    height: h,
  }
}


export function size2Num(size: IThumbnailSize) {
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
