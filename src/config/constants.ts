export const SIZE_HIT_TOLERANCE = 0.2

export enum RESIZE_MODE {
  LFIT = 'lfit',
  MFIT = 'mfit',
  FILL = 'fill',
}

export enum RESIZE_PATTERN {
  WIDTH_100_HEIGHT_100 = 'w100_h100',
  WIDTH_240_HEIGHT_240 = 'w240_h240',
  WIDTH_360_HEIGHT_360 = 'w360_h360',
  WIDTH_360_HEIGHT_480 = 'w360_h480',
  WIDTH_540_HEIGHT_540 = 'w540_h540',
  WIDTH_540_HEIGHT_432 = 'w540_h432',
  WIDTH_750_HEIGHT_750 = 'w750_h750',
  WIDTH_1080_HEIGHT_1080 = 'w1080_h1080',
  WIDTH_1080_HEIGHT_1920 = 'w1080_h1920',

  WIDTH_100 = 'w100',
  WIDTH_240 = 'w240',
  WIDTH_360 = 'w360',
  WIDTH_540 = 'w540',
  WIDTH_750 = 'w750',
  WIDTH_1080 = 'w1080',

  HEIGHT_400 = 'h400',
}

export const WidthHeightReg = /^(w(\d+)|h(\d+)|w(\d+)_h(\d+))$/

export const VideoExtList = [
  'mp4',
  'avi',
  'mov',
  'wmv',
  'flv',
  'mkv',
  'webm',
  'm4v',
  '3gp',
  '3g2',
  'ts',
  'mts',
  'm2ts',
  'vob',
  'ogv',
  'rm',
  'rmvb',
  'asf',
  'divx',
  'xvid',
  'mxf',
  'dv',
  'dvr-ms',
  'f4v',
  'f4p',
  'f4a',
  'f4b',
  'm2v',
  'm1v',
  'mjpeg',
  'mjpg',
  'mpeg',
  'mpg',
  'mp2',
  'mpv',
  'mts',
  'm2t',
  'm2ts',
  'nut',
  'nsv',
  'ps',
  'rec',
  'rm',
  'rmvb',
  'swf',
  'ts',
  'vob',
  'vp6',
  'vp7',
  'vp8',
  'vp9',
  'webm',
  'wm',
  'wmv',
  'yuv',
]

export enum FORMAT_PATTERN {
  AUTO = 'auto',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif',
  GIF = 'gif',
}

export enum SHORT_RULE {
  INFO = 'info',
  COLOR = 'color',
  SNAPSHOT = 'snapshot',
  THUMBNAIL = 'thumbnail',
}

export enum URL_BUILDER_SIGN {
  URL_SPLITER = '!',
  PARAM_SPLITER = '_',
  ROTATE_SIGN = 'rotate',
  WATERMARK_SIGN = 'watermark',
  ORIGIN_SIGN = 'origin',
}

export const DEFAULT_OSS_AVATAR =
  'https://cdn.qiandaoapp.com/admins/e9ace2e2dac30ed544ae393f52a0a0e0.png'

export const DEFAULT_OSS_PLACEHOLDER =
  'https://cdn.qiandaoapp.com/interior/images/d93e104410367f82633c043b7d88a54d.png'
