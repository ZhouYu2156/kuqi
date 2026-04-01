import { nextTick } from 'vue'

/**
 * 在支持时使用 View Transitions API 切换亮/暗色，实现整页渐隐过渡（类似 vuejs.org）。
 */
export function useColorModeViewTransition() {
  const colorMode = useColorMode()

  async function toggleTheme() {
    const isDark = colorMode.value === 'dark'
    const next = isDark ? 'light' : 'dark'

    const apply = async () => {
      colorMode.preference = next
      await nextTick()
    }

    if (typeof document === 'undefined') {
      await apply()
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await apply()
      return
    }

    if (typeof document.startViewTransition !== 'function') {
      await apply()
      return
    }

    await document.startViewTransition(apply).finished
  }

  return { toggleTheme, colorMode }
}
