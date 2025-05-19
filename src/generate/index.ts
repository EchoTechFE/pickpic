import { AliyunUrlProcessBuilder } from './aliyun'
import { CloudflareUrlProcessBuilder } from './cloudflare'
import { singletonPickPicInstance, findAspect } from '../pick'
import { BUILDER_PROVIDER_MAP } from '../config/constants'
import { IUrlProcessBuilder } from './base'

const PROVIDER_BUILDER_LIST = [
  AliyunUrlProcessBuilder,
  CloudflareUrlProcessBuilder,
]

export function newUrlProcessBuilder(url: string): IUrlProcessBuilder {
  const region = singletonPickPicInstance?.config?.region

  const provider =
    region === 'CN'
      ? BUILDER_PROVIDER_MAP.ALIYUN
      : BUILDER_PROVIDER_MAP.CLOUDFLARE

  for (const builder of PROVIDER_BUILDER_LIST) {
    if (builder.provider === provider) {
      return new builder(url)
    }
  }

  throw new Error(`No builder found for provider: ${provider}`)
}

interface GetSuitableUrlContext {
  width: number
  height: number
  mode: string
  widthFirst: boolean
  styleName?: string
}

export function getSuitableUrlWithContext(
  url: string,
  ctx: GetSuitableUrlContext,
) {
  const urlProcess = newUrlProcessBuilder(url)

  const alignStyle = findAspect(
    {
      width: ctx.width,
      height: ctx.height,
    },
    {
      widthFirst: ctx.widthFirst,
      mode: ctx.mode,
    },
  )

  if (ctx.styleName) {
    urlProcess.styleName(ctx.styleName)
  }

  urlProcess
    .mode(alignStyle.m)
    .resize(
      `${
        !alignStyle.h
          ? `w${alignStyle.w}`
          : !alignStyle.w
            ? `h${alignStyle.h}`
            : `w${alignStyle.w}_h${alignStyle.h}`
      }`,
    )

  return urlProcess.build()
}
