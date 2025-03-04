import { FORMAT_PATTERN, RESIZE_MODE, RESIZE_PATTERN } from './contants'
import { NewUrlProcessBuilder } from './generate'
import { expect, test } from 'vitest'

test('get image info form url and ignore imginfo after build', () => {
  const mockUrl =
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg?imginfo=w1280,h1707'

  const builder = NewUrlProcessBuilder().Url(mockUrl)

  const imgInfo = builder.Parse()

  const result = builder.Build()

  expect(imgInfo).toEqual({
    width: 1280,
    height: 1707,
  })

  expect(result).toEqual(
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg',
  )
})

test('add url params', () => {
  const mockUrl =
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg?imginfo=w1280,h1707'

  const builder = NewUrlProcessBuilder().Url(mockUrl)

  const finalUrl = builder
    .Mode(RESIZE_MODE.FILL)
    .Resize(RESIZE_PATTERN.WIDTH_100_HEIGHT_100)
    .Format(FORMAT_PATTERN.WEBP)
    .Build()

  expect(finalUrl).toEqual(
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg!fill_w100_h100_webp',
  )
})
