<template>
  <div class="thumbnail-image" :style="thumbnailStyle">
    <img
      v-if="clickStop"
      id="thumbnail-image-img"
      :class="[
        {
          'thumbnail-image--fade-in': fadeIn,
          'thumbnail-image--loaded': fadeIn && showDisplayImage,
        },
      ]"
      :style="thumbnailImageStyle"
      :src="displaySrc"
      :mode="mode"
      @click.stop="handlePreview"
      @load="handleImageLoaded"
      @error="handleImageError"
    />
    <img
      v-else
      id="thumbnail-image-img"
      :class="[
        {
          'thumbnail-image--fade-in': fadeIn,
          'thumbnail-image--loaded': fadeIn && showDisplayImage,
        },
      ]"
      :style="thumbnailImageStyle"
      :src="displaySrc"
      :mode="mode"
      :show-menu-by-longpress="showMenuByLongPress"
      @click="handlePreview"
      @load="handleImageLoaded"
      @error="handleImageError"
    />
    <slot v-if="useSlot" />

    <slot name="icon"></slot>
  </div>
</template>

<script setup lang="ts">
import type { IThumbnailSize } from '../types'

import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
  getCurrentInstance,
  normalizeStyle,
} from 'vue'
import {
  DEFAULT_OSS_AVATAR,
  DEFAULT_OSS_PLACEHOLDER,
} from '../config/constants'
import { findAspect, previewImage } from './index'

import { newUrlProcessBuilder } from '../generate'

const props = withDefaults(
  defineProps<{
    url: string
    defaultUrl?: string
    size: IThumbnailSize
    resize?: boolean
    withBorder?: boolean
    borderRadius?: number | string
    borderWidth?: number | string
    borderColor?: string
    preview?: boolean
    previewIndex?: number
    previewList?: string[] | null
    withFirst?: boolean
    useSlot?: boolean
    mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix'
    fadeIn?: boolean

    clickStop?: boolean
    showMenuByLongPress?: boolean
    mediaType?: string

    extraStyle?: Record<string, string> | null
    extImageStyle?: Record<string, string> | null
  }>(),
  {
    defaultUrl: DEFAULT_OSS_PLACEHOLDER,
    resize: true,
    withBorder: false,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(32, 36, 38, 0.06)',
    preview: false,
    previewIndex: 0,
    previewList: null,
    withFirst: false,
    useSlot: false,
    mode: 'aspectFill',
    fadeIn: false,

    clickStop: false,
    showMenuByLongPress: false,
    mediaType: 'image',

    extraStyle: null,
    extImageStyle: null,
  },
)

const emit = defineEmits(['load', 'error', 'click'])

const showDisplayImage = ref(false)
const realUrl = ref('')
const displaySrc = ref('')
const realSize = ref<null | { width: number; height: number }>(null)

let observer: ReturnType<typeof uni.createIntersectionObserver> | null = null

const isExpose = ref(false)

const cssWidth = computed(() => {
  const {
    size: { width, height },
    mode,
  } = props
  const DEFAULT_WIDTH = '100%'

  if (!width && !height) return DEFAULT_WIDTH
  if (!width) {
    if (height && mode === 'heightFix') {
      return ''
    } else {
      return DEFAULT_WIDTH
    }
  }

  return typeof width === 'string' ? width : `${width}rpx`
})

const cssHeight = computed(() => {
  const {
    size: { height, width },
    mode,
  } = props
  const DEFAULT_HEIGHT = '100%'
  if (!width && !height) return DEFAULT_HEIGHT
  if (!height) {
    if (width && mode === 'widthFix') {
      return ''
    } else {
      return DEFAULT_HEIGHT
    }
  }

  return typeof height === 'string' ? height : `${height}rpx`
})

const backgroundImage = computed(() => {
  if (showDisplayImage.value) {
    return ''
  }

  if (props.defaultUrl) {
    return `url(${props.defaultUrl})`
  }

  return ''
})

const cssBorderRadius = computed(() => {
  const { borderRadius } = props

  return typeof borderRadius === 'number' || !Number.isNaN(+borderRadius)
    ? `${borderRadius}rpx`
    : borderRadius
})
const thumbnailStyle = computed(() => {
  return normalizeStyle({
    ...props.extraStyle,
    // 这里还没想到更好的办法,320px,240px是微信的默认值
    width: cssWidth.value,
    height: cssHeight.value,
  })
})

const thumbnailImageStyle = computed(() => {
  const { borderWidth, borderColor, withBorder, extImageStyle } = props

  return normalizeStyle({
    'border-radius': cssBorderRadius.value,
    width: cssWidth.value,
    height: cssHeight.value,
    border: withBorder ? `${borderWidth}rpx solid ${borderColor}` : 'none',
    'background-image': showDisplayImage.value ? '' : backgroundImage.value,
    'background-size': 'cover',
    'background-position': 'center',
    ...extImageStyle,
  })
})

watch([() => props.url, isExpose], () => {
  if (isExpose.value) {
    setDisplaySrc()
  }
})

onMounted(() => {
  const instance = getCurrentInstance()!

  // @ts-ignore
  observer = uni.createIntersectionObserver(instance)

  // @ts-ignore
  observer.relativeToViewport({ bottom: 150 })

  observer.observe('#thumbnail-image-img', (res) => {
    const { width, height } = res.boundingClientRect as {
      width: number
      height: number
    }

    realSize.value = {
      width,
      height,
    }

    isExpose.value = true

    observer?.disconnect()
    observer = null
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

async function setDisplaySrc() {
  if (!realSize.value) {
    return
  }
  const { url, withFirst, defaultUrl } = props

  if (!url) {
    displaySrc.value = defaultUrl
    return
  }

  const urlProcess = newUrlProcessBuilder(url)

  const alignStyle = findAspect(realSize.value, {
    withFirst,
    mode: props.mode,
  })

  if (props.size?.styleName) {
    urlProcess.styleName(props.size.styleName)
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

  displaySrc.value = urlProcess.build()
}

function handlePreview() {
  if (props.preview && realUrl.value) {
    previewImage({
      items: props.previewList?.map((url) => {
        return {
          url,
        }
      }) || [
        {
          url: realUrl.value,
        },
      ],
      size: props.size,
      current: props.previewIndex,
    })
  }
  emit('click')
}

function handleImageLoaded() {
  showDisplayImage.value = true
  emit('load')
}

function handleImageError() {
  emit('error')
}
</script>

<style lang="scss">
.thumbnail-image {
  position: relative;

  display: block;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &--fade-in {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &--loaded {
    opacity: 1;
  }
}
</style>
