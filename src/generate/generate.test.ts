import { FORMAT_PATTERN, RESIZE_MODE, RESIZE_PATTERN } from '../config/constants'
import { newUrlProcessBuilder } from './index'
import { expect, test } from 'vitest'

test('get image info form url and ignore imginfo after build', () => {
  const mockUrl =
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg?imginfo=w1280,h1707'

  const builder = newUrlProcessBuilder(mockUrl)

  const imgInfo = builder.parse()

  const result = builder.build()

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

  const builder = newUrlProcessBuilder(mockUrl)

  const finalUrl = builder
    .mode(RESIZE_MODE.FILL)
    .resize(RESIZE_PATTERN.WIDTH_100_HEIGHT_100)
    .format(FORMAT_PATTERN.WEBP)
    .build()

  expect(finalUrl).toEqual(
    'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg!fill_w100_h100_webp',
  )
})
