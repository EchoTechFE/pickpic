import { URL_BUILDER_SIGN } from './contants'

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
    const matches = url.match(urlPattern)

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
    this.searchParams = this.ParseSearchParams(this.search)
    // 哈希部分
    this.hash = matches[8] ? '#' + matches[8] : ''
  }

  // 解析查询字符串为对象
  ParseSearchParams(search: string) {
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
  SerializeSearchParams() {
    const paramsArray = []
    for (const [key, value] of this.searchParams) {
      paramsArray.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
      )
    }
    return paramsArray.length > 0 ? '?' + paramsArray.join('&') : ''
  }

  // 获取完整的 URL 字符串
  ToString() {
    let url = this.protocol
    if (this.host) {
      url += '//' + this.host
    }
    url += this.pathname
    url += this.SerializeSearchParams()
    url += this.hash
    return url
  }

  JoinPath(...params: string[]) {
    return this.ToString() + URL_SPLITER + params.join('')
  }
}
