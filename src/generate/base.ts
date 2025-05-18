import { CustomURL } from '../utils/url'

interface IParseMeta {
  width: number
  height: number
}

export interface IUrlProcessBuilder {
  rawUrl: string
  urlStruct?: CustomURL
  parseMeta: IParseMeta | null
  params: Record<string, any>
  mode(mode: string): this
  resize(pattern: string): this
  format(pattern: string): this
  rotate(degree: number): this
  watermark(): this
  origin(): this
  snapshot(): this
  styleName(style: string): this
  color(): this
  info(): this
  parse(): IParseMeta
  parseAsync(): Promise<IParseMeta>
  build(): string
}
