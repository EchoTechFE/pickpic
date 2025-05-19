# pickpic

选择一个图片裁切参数



## 初始化

1. 在项目 main 函数中使用

`import * as pickpic from "pickpic"`

`pickpic.init(pickPicConfig)`

| 参数               | 说明              | 类型                    | 默认值    |
|------------------|-----------------|-----------------------|--------|
| resizeMode       | 图片缩放模式          | Record<string,string> | -      |
| resizePattern    | 限定的图片裁切宽高值      | Record<string,string> | -      |
| formatPattern    | 可转换的图片格式        | Record<string,string> | {}     |
| shortRule        | CDN 可识别的短规则     | Record<string,string> | true   |
| urlBuilderSign   | 默认裁切相关的符号       | Record<string,string> | number | 0 |
| fallbackStyles   | 未匹配到裁切时的默认裁切字符串 | Record<string,string> |        |
| enableCache      | 裁切参数是否开启缓存      | boolean               | true   |
| sizeHitTolerance | 匹配到临近裁切参数的阈值    | number                | 0.2    |
| queryEngine      | 获取图片元信息需要的请求引擎  | {get:function}        |        |
| decodeFunc       | 解析 url 的函数      | function              |        |
| region           | 地区字符串           | string                | CN     |


## Thumbnail Vue 组件 API
`import Thumbnail from 'pickpic/thumbnail'`

| 成员              | 说明                                                                                          | 类型                                                                          | 默认值                    |
|-----------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|------------------------|
| url             | 图片地址的 URL                                                                                   | stirng                                                                      | -                      |
| defaultUrl      | 当没有提供 url 的时候，显示的默认占位图片                                                                     | stirng                                                                      | -                      |
| size            | 图片尺寸，styleName 取值：[图片规格](https://echotech.feishu.cn/sheets/shtcnXPvJB3BkJXnInb2tmQkfLB)     | `{ width: string \| number; height: string \| number; styleName: string; }` | {}                     |
| resize          | 智能给图片增加图片剪裁参数                                                                               | boolean                                                                     | true                   |
| borderRadius    | 圆角，单位为 rpx                                                                                  | string                                                                      | number                 | 0 |
| borderWidth     | 边框宽度，只能是数字或者数字字符串，单位为 rpx                                                                   | string                                                                      | 2                      |
| preview         | 是否支持预览                                                                                      | number                                                                      | false                  |
| withBorder      | 是否有边框                                                                                       | boolean                                                                     | false                  |
| borderColor     | 边框颜色                                                                                        | string                                                                      | rgba(32, 36, 38, 0.06) |
| skipCompressGif | 跳过对 gif 的压缩                                                                                 | boolean                                                                     | false                  |
| withFirst       | 自动增加裁切参数的时候，优先以宽度去寻找最匹配的剪裁参数                                                                | boolean                                                                     | false                  |
| useSlot         | 支持给组件传 slot，位置在 image 下方                                                                    | boolean                                                                     | false                  |
| mode            | 图片裁剪、缩放的模式 [image文档](https://developers.weixin.qq.com/miniprogram/dev/component/image.html) | string                                                                      | aspectFill             |
| fadeIn          | 给图片增加一个渐进动画                                                                                 | boolean                                                                     | false                  |



## 自定义
1. 全局只会在 init 的时候初始化一个 singletonPickPicInstance 并与 thumbnail/image.vue 绑定
2. 如果有自定义生成 url 不使用 Thumbnail 的形式，可以使用 newPickPicInstance 方法实例化并自行调用