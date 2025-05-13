import {
  RESIZE_MODE,
  RESIZE_PATTERN,
  FORMAT_PATTERN,
  SHORT_RULE,
  URL_BUILDER_SIGN,
  SIZE_HIT_TOLERANCE,
} from './constants'
import { IPickPicConfig } from '../types'

export const defaultPickPicConfig: IPickPicConfig = {
  resizeMode: RESIZE_MODE,
  resizePattern: RESIZE_PATTERN,
  formatPattern: FORMAT_PATTERN,
  shortRule: SHORT_RULE,
  urlBuilderSign: URL_BUILDER_SIGN,
  fallbackStyles: {
    default: 'lfit_w1080',
  },
  enableCache: true,
  sizeHitTolerance: SIZE_HIT_TOLERANCE,
  queryEngine: null,
  decodeFunc: null,
} as const
