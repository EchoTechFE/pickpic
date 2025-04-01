import { init, singletonPickPicInstance } from './pick'
import { expect, test } from 'vitest'
import { FORMAT_PATTERN } from './config/constants'

test('lagacy style', () => {
  init({
    resizePattern: {
      WIDTH_250_HEIGHT_400: 'w250_h400',
      WIDTH_300_HEIGHT_480: 'w300_h480',
      WIDTH_180: 'w180',
      WIDTH_240: 'w240',
      WIDTH_480: 'w480',
      WIDTH_540: 'w540',
      WIDTH_600: 'w600',
      WIDTH_750: 'w750',
      WIDTH_900: 'w900',
      WIDTH_1080: 'w1080',
      WIDTH_240_HEIGHT_320: 'w240_h320',
      WIDTH_480_HEIGHT_640: 'w480_h640',
      WIDTH_540_HEIGHT_720: 'w540_h720',
      WIDTH_720_HEIGHT_960: 'w720_h960',
      WIDTH_50_HEIGHT_50: 'w50_h50',
      WIDTH_100_HEIGHT_100: 'w100_h100',
      WIDTH_200_HEIGHT_200: 'w200_h200',
      WIDTH_300_HEIGHT_300: 'w300_h300',
      WIDTH_400_HEIGHT_400: 'w400_h400',
      WIDTH_500_HEIGHT_500: 'w500_h500',
      WIDTH_540_HEIGHT_540: 'w540_h540',
      WIDTH_720_HEIGHT_720: 'w720_h720',
      WIDTH_500_HEIGHT_400: 'w500_h400',
      WIDTH_750_HEIGHT_600: 'w750_h600',
      WIDTH_320_HEIGHT_240: 'w320_h240',
      WIDTH_720_HEIGHT_540: 'w720_h540',
      WIDTH_1080_HEIGHT_810: 'w1080_h810',
      WIDTH_710_HEIGHT_400: 'w710_h400',
      WIDTH_900_HEIGHT_300: 'w900_h300',
      WIDTH_700_HEIGHT_100: 'w700_h100',
    },
    fallbackStyles: {
      default: 'lfit_w1080',
    },
    enableCache: true,
  })

  expect(
    singletonPickPicInstance?.getStyle({
      width: 72,
      height: 96,
      format: FORMAT_PATTERN.WEBP,
      fit: 'cover',
    }).id,
  ).toBe('fill_w240_h320_webp')
})

test('should find best style', () => {
  init({
    resizePattern: {
      WIDTH_100_HEIGHT_100: 'w100_h100',
      WIDTH_240_HEIGHT_240: 'w240_h240',
      WIDTH_360_HEIGHT_360: 'w360_h360',
      WIDTH_540_HEIGHT_540: 'w540_h540',
      WIDTH_360_HEIGHT_480: 'w360_h480',
      WIDTH_100: 'w100',
      WIDTH_240: 'w240',
      WIDTH_540: 'w540',
      WIDTH_750: 'w750',
      WIDTH_1080: 'w1080',
      WIDTH_1080_HEIGHT_1920: 'w1080_h1920',
    },
    fallbackStyles: {
      default: 'lfit_w1080',
    },
    enableCache: false,
  })

  expect(
    singletonPickPicInstance?.getStyle({
      width: 100,
      height: 100,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w100_h100')

  // 20% 误差内，取低档位
  expect(
    singletonPickPicInstance?.getStyle({
      width: 110,
      height: 111,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w100_h100')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 200,
      height: 201,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w240_h240')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 300,
      height: 300,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w360_h360')

  // expect(
  //   singletonPickPicInstance?.getStyle({
  //     width: 200,
  //     height: 300,
  //     format: FORMAT_PATTERN.JPG,
  //     fit: 'cover',
  //   })?.id,
  // ).toBe('lfit_w240')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 240,
      height: 300,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('lfit_w240')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 540,
      height: 300,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('lfit_w540')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 300,
      height: 400,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w360_h480')

  // 有匹配的比例，即使图片质量比较低，也会采用
  expect(
    singletonPickPicInstance?.getStyle({
      width: 1000,
      height: 1000,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    })?.id,
  ).toBe('fill_w540_h540')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 100,
      height: 100,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w100_h100')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 800,
      height: 800,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w750')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 900,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 1000,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 1100,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 1200,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 1900,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 900,
      height: 1200,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 1080,
      height: 1920,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920')

  // 如果容器宽度比较大
  expect(
    singletonPickPicInstance?.getStyle({
      width: 2000,
      height: 2000,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    }).id,
  ).toBe('fill_w540_h540')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 2000,
      height: 8000,
      format: FORMAT_PATTERN.JPG,
      fit: 'cover',
    }).id,
  ).toBe('lfit_w1080')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 2000,
      height: 4000,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 2000,
      height: 3500,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080_h1920')

  // 只有宽度
  expect(
    singletonPickPicInstance?.getStyle({
      width: 118,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    }).id,
  ).toBe('lfit_w100')

  expect(
    singletonPickPicInstance?.getStyle({
      width: 400,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    }).id,
  ).toBe('lfit_w540')

  // 只有高度的，目前会落在这里
  expect(
    singletonPickPicInstance?.getStyle({
      height: 200,
      format: FORMAT_PATTERN.JPG,
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080')
})
