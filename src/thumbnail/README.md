# Thumbnail 缩略图

```js
import Thumbnail from '@/modules/components/thumbnail/image'
```

## 何时使用

任何使用接口回传过来的图片，都应该使用 Thumbnail 组件

## API

| 成员 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 图片地址的 URL | stirng | - |
| defaultUrl | 当没有提供 url 的时候，显示的默认占位图片 | stirng | - |
| size | 图片尺寸，styleName 取值：[图片规格](https://echotech.feishu.cn/sheets/shtcnXPvJB3BkJXnInb2tmQkfLB) | `{ width: string \| number; height: string \| number; styleName: string; }` | {} |
| resize | 智能给图片增加图片剪裁参数 | boolean | true |
| borderRadius | 圆角，单位为 rpx | string | number | 0 |
| borderWidth | 边框宽度，只能是数字或者数字字符串，单位为 rpx | string | 2 |
| preview | 是否支持预览 | number | false |
| withBorder | 是否有边框 | boolean | false |
| borderColor | 边框颜色 | string | rgba(32, 36, 38, 0.06) |
| skipCompressGif | 跳过对 gif 的压缩 | boolean | false |
| withFirst | 自动增加裁切参数的时候，优先以宽度去寻找最匹配的剪裁参数 | boolean | false |
| useSlot | 支持给组件传 slot，位置在 image 下方 | boolean | false |
| mode | 图片裁剪、缩放的模式 [image文档](https://developers.weixin.qq.com/miniprogram/dev/component/image.html) | string | aspectFill |
| fadeIn | 给图片增加一个渐进动画 | boolean | false |

## 示例

```vue
<thumbnail
  :url="me.avatar"
  :size="{ width: 104, height: 104 }"
  :borderRadius="12"
/>
```

## FAQ

暂无
