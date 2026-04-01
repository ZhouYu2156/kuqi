<script setup lang="ts">
import { computed } from 'vue'

/** 与 UColorModeButton 对齐的常用 props，用于顶栏样式一致 */
const props = defineProps({
  color: { type: null, required: false, default: 'neutral' },
  variant: { type: null, required: false, default: 'ghost' },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
})

defineOptions({ inheritAttrs: false })

const appConfig = useAppConfig()
const { toggleTheme, colorMode } = useColorModeViewTransition()

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <UButton
    v-bind="{
      ...props,
      square: true,
      'aria-label': isDark ? '切换到浅色模式' : '切换到深色模式',
      ...$attrs,
    }"
    @click="toggleTheme">
    <template #leading="{ ui }">
      <UIcon
        :class="ui.leadingIcon({ class: ['hidden dark:inline-block'] })"
        :name="appConfig.ui.icons.dark" />
      <UIcon
        :class="ui.leadingIcon({ class: ['dark:hidden'] })"
        :name="appConfig.ui.icons.light" />
    </template>
  </UButton>
</template>
