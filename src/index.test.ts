import type { ImageFormat, ImageStyle } from './index'
import { PickPic } from './index'
import { test, expect } from 'vitest'

test('lagacy style', () => {
  const styles = [
    'lfit_w250_h400_jpg',
    'lfit_w300_h480_jpg',
    'lfit_w180_jpg',
    'lfit_w240_jpg',
    'lfit_w480_jpg',
    'lfit_w540_jpg',
    'lfit_w600_png',
    'lfit_w750_jpg',
    'lfit_w900_png',
    'lfit_w240_png',
    'lfit_w1080_jpg',
    'lfit_w400_h640_jpg',
    'lfit_w500_h800_jpg',
    'lfit_w1080_h1920_jpg',
    'fill_w240_h320_jpg',
    'fill_w480_h640_jpg',
    'fill_w540_h720_jpg',
    'fill_w720_h960_jpg',
    'fill_w50_h50_jpg',
    'fill_w100_h100_jpg',
    'fill_w200_h200_png',
    'fill_w300_h300_jpg',
    'fill_w400_h400_jpg',
    'fill_w500_h500_jpg',
    'fill_w540_h540_jpg',
    'fill_w720_h720_jpg',
    'fill_w500_h400_jpg',
    'fill_w750_h600_jpg',
    'fill_w750_h600_png',
    'fill_w320_h240_jpg',
    'fill_w720_h540_jpg',
    'fill_w1080_h810_jpg',
    'fill_w710_h400_jpg',
    'fill_w900_h300_jpg',
    'fill_w700_h100_jpg',
  ].flatMap((stylename) => {
    let [fit, w, h, format] = stylename.split('_') as [
      'lfit' | 'mfit' | 'fill',
      any,
      any,
      ImageFormat,
    ]
    if (!format) {
      format = h
      h = 'h0'
    }

    const imageStyles = [
      {
        id: stylename,
        w: +w.slice(1),
        h: +h.slice(1),
        f: format,
        m: fit,
      },
    ]
    if (format === 'jpg') {
      imageStyles.push({
        id: `${stylename}_webp`,
        w: +w.slice(1),
        h: +h.slice(1),
        f: 'webp',
        m: fit,
      })
    }
    return imageStyles as ImageStyle[]
  })

  const pickPic = new PickPic({
    styles,
    fallbackStyles: {
      default: 'lfit_w1080_jpg',
    },
    enableCache: true,
  })

  expect(
    pickPic.getStyle({
      width: 72,
      height: 96,
      format: 'webp',
      fit: 'cover',
    }).id,
  ).toBe('fill_w240_h320_jpg_webp')
})

test('should find best style', () => {
  const pickPic = new PickPic({
    styles: [
      {
        id: 'fill_w100_h100_jpg',
        w: 100,
        h: 100,
        m: 'fill',
        f: 'jpg',
      },
      {
        id: 'fill_w240_h240_jpg',
        w: 240,
        h: 240,
        m: 'fill',
        f: 'jpg',
      },
      {
        id: 'fill_w360_h360_jpg',
        w: 360,
        h: 360,
        m: 'fill',
        f: 'jpg',
      },
      {
        id: 'fill_w540_h540_jpg',
        w: 540,
        h: 540,
        m: 'fill',
        f: 'jpg',
      },
      {
        id: 'fill_w360_h480_jpg',
        w: 360,
        h: 480,
        m: 'fill',
        f: 'jpg',
      },
      {
        id: 'lfit_w100_jpg',
        w: 100,
        h: 0,
        m: 'lfit',
        f: 'jpg',
      },
      {
        id: 'lfit_w240_jpg',
        w: 240,
        h: 0,
        m: 'lfit',
        f: 'jpg',
      },
      {
        id: 'lfit_w540_jpg',
        w: 540,
        h: 0,
        m: 'lfit',
        f: 'jpg',
      },
      {
        id: 'lfit_w750_jpg',
        w: 750,
        h: 0,
        m: 'lfit',
        f: 'jpg',
      },
      {
        id: 'lfit_w1080_jpg',
        w: 1080,
        h: 0,
        m: 'lfit',
        f: 'jpg',
      },
      {
        id: 'lfit_w1080_h1920_jpg',
        w: 1080,
        h: 1920,
        m: 'lfit',
        f: 'jpg',
      },
    ],
    fallbackStyles: {
      default: 'lfit_w1080_jpg',
    },
    enableCache: false,
  })

  expect(
    pickPic.getStyle({ width: 100, height: 100, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w100_h100_jpg')

  // 20% 误差内，取低档位
  expect(
    pickPic.getStyle({ width: 110, height: 111, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w100_h100_jpg')

  expect(
    pickPic.getStyle({ width: 200, height: 201, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w240_h240_jpg')

  expect(
    pickPic.getStyle({ width: 300, height: 300, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w360_h360_jpg')

  expect(
    pickPic.getStyle({ width: 200, height: 300, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('lfit_w240_jpg')

  expect(
    pickPic.getStyle({ width: 240, height: 300, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('lfit_w240_jpg')

  expect(
    pickPic.getStyle({ width: 540, height: 300, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('lfit_w540_jpg')

  expect(
    pickPic.getStyle({ width: 300, height: 400, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w360_h480_jpg')

  // 有匹配的比例，即使图片质量比较低，也会采用
  expect(
    pickPic.getStyle({ width: 1000, height: 1000, format: 'jpg', fit: 'cover' })
      ?.id,
  ).toBe('fill_w540_h540_jpg')

  expect(
    pickPic.getStyle({
      width: 100,
      height: 100,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w100_jpg')

  expect(
    pickPic.getStyle({
      width: 800,
      height: 800,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w750_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 900,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 1000,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 1100,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 1200,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 1900,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_jpg')

  expect(
    pickPic.getStyle({
      width: 900,
      height: 1200,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  expect(
    pickPic.getStyle({
      width: 1080,
      height: 1920,
      format: 'jpg',
      fit: 'contain',
    })?.id,
  ).toBe('lfit_w1080_h1920_jpg')

  // 如果容器宽度比较大
  expect(
    pickPic.getStyle({
      width: 2000,
      height: 2000,
      format: 'jpg',
      fit: 'cover',
    }).id,
  ).toBe('fill_w540_h540_jpg')

  expect(
    pickPic.getStyle({
      width: 2000,
      height: 8000,
      format: 'jpg',
      fit: 'cover',
    }).id,
  ).toBe('lfit_w1080_jpg')

  expect(
    pickPic.getStyle({
      width: 2000,
      height: 4000,
      format: 'jpg',
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080_jpg')

  expect(
    pickPic.getStyle({
      width: 2000,
      height: 3500,
      format: 'jpg',
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080_h1920_jpg')

  // 只有宽度
  expect(
    pickPic.getStyle({
      width: 118,
      format: 'jpg',
      fit: 'contain',
    }).id,
  ).toBe('lfit_w100_jpg')

  expect(
    pickPic.getStyle({
      width: 400,
      format: 'jpg',
      fit: 'contain',
    }).id,
  ).toBe('lfit_w540_jpg')

  // 只有高度的，目前会落在这里
  expect(
    pickPic.getStyle({
      height: 200,
      format: 'jpg',
      fit: 'contain',
    }).id,
  ).toBe('lfit_w1080_h1920_jpg')
})
