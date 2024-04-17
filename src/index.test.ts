import { PickPic } from './index'
import { test, expect } from 'vitest'

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
    fallbackStyle: {
      id: 'lfit_w1080_jpg',
      w: 1080,
      h: 0,
      m: 'lfit',
      f: 'jpg',
    },
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
})
