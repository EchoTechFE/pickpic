import {
  CLOUDFLARE_RESIZE_MODE,
  FORMAT_PATTERN,
  RESIZE_MODE,
  RESIZE_PATTERN,
} from '../config/constants'
import { newUrlProcessBuilder } from './index'
import { expect, test } from 'vitest'
import { init, singletonPickPicInstance } from '../pick'

const Fly = require('flyio')

init({
  queryEngine: Fly,
  whiteHostList:['qiandao']
})

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

test('async get image info', async () => {
  const mockUrl = 'https://trade.qiandaocdn.com/trade/images/Es6stFk4FV.jpg'

  const builder = newUrlProcessBuilder(mockUrl)
  const imgInfo = await builder.parseAsync()

  expect(imgInfo).toEqual({
    width: 1280,
    height: 1707,
  })
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

test('cloudflare process params', () => {
  const mockUrl =
    'https://image.tensorartassets.com/posts/images/740551773416304425/d6b7e84a-f8a0-440c-b6ea-90b52022a6e3.png'

  singletonPickPicInstance?.setRegion('sg')

  const builder = newUrlProcessBuilder(mockUrl)

  const finalUrl = builder
    .mode(CLOUDFLARE_RESIZE_MODE.CONTAIN)
    .resize(RESIZE_PATTERN.WIDTH_100_HEIGHT_100)
    .format(FORMAT_PATTERN.WEBP)
    .build()

  console.info("finalUrl", finalUrl)
})
