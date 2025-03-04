export enum RESIZE_MODE {
  LFIT = 'lfit',
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

export enum FORMAT_PATTERN {
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif',
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
