import { FORMAT_PATTERN } from '../config/constants'

export interface IPickPicConfig {
  resizeMode: Record<string, string>
  resizePattern: Record<string, string>
  formatPattern: Record<string, string>
  shortRule: Record<string, string>
  urlBuilderSign: Record<string, string>

  fallbackStyles: Record<string, string>
  enableCache: boolean
  sizeHitTolerance: number
  queryEngine: queryEngine | null
  decodeFunc: ((url: string) => string) | null

  whiteHostList: string[] | null

  region: string
}

interface queryEngine {
  get: (key: string) => any
}

export interface IImageStyle {
  id: string
  w: number
  h: number
  m: string
  f: FORMAT_PATTERN
}

export interface IThumbnailSize {
  width: number | string
  height: number | string
  format?: FORMAT_PATTERN
  styleName?: string
  mode?: string
}
