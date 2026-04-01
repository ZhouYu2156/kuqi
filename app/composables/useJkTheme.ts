import type { CSSProperties } from 'vue'

export type JkAccentPreset = {
  id: string
  label: string
  /** 主色（按钮、高亮） */
  primary: string
  /** 浅底 hover */
  soft: string
  /** 描边/光晕 */
  ring: string
}

const STORAGE_KEY = 'jk-accent-id'

/** Nuxt 官网翠绿色 + 多种备选主色（含品红、深粉、金黄、红紫等） */
export const JK_ACCENT_PRESETS: readonly JkAccentPreset[] = [
  { id: 'nuxt', label: 'Nuxt 翠', primary: '#00dc82', soft: 'rgba(0, 220, 130, 0.12)', ring: 'rgba(0, 220, 130, 0.35)' },
  { id: 'emerald', label: '祖母绿', primary: '#34d399', soft: 'rgba(52, 211, 153, 0.14)', ring: 'rgba(52, 211, 153, 0.35)' },
  { id: 'teal', label: '青绿', primary: '#2dd4bf', soft: 'rgba(45, 212, 191, 0.14)', ring: 'rgba(45, 212, 191, 0.35)' },
  { id: 'lime', label: '酸橙', primary: '#a3e635', soft: 'rgba(163, 230, 53, 0.14)', ring: 'rgba(163, 230, 53, 0.35)' },
  { id: 'sky', label: '天蓝', primary: '#38bdf8', soft: 'rgba(56, 189, 248, 0.14)', ring: 'rgba(56, 189, 248, 0.35)' },
  { id: 'violet', label: '紫罗兰', primary: '#a78bfa', soft: 'rgba(167, 139, 250, 0.14)', ring: 'rgba(167, 139, 250, 0.35)' },
  { id: 'magenta', label: '品红', primary: '#e91e8c', soft: 'rgba(233, 30, 140, 0.14)', ring: 'rgba(233, 30, 140, 0.38)' },
  { id: 'deeppink', label: '深粉', primary: '#be185d', soft: 'rgba(190, 24, 93, 0.14)', ring: 'rgba(190, 24, 93, 0.38)' },
  { id: 'gold', label: '金黄', primary: '#eab308', soft: 'rgba(234, 179, 8, 0.18)', ring: 'rgba(234, 179, 8, 0.42)' },
  { id: 'amber', label: '琥珀', primary: '#f59e0b', soft: 'rgba(245, 158, 11, 0.16)', ring: 'rgba(245, 158, 11, 0.4)' },
  { id: 'redviolet', label: '红紫', primary: '#c026d3', soft: 'rgba(192, 38, 211, 0.14)', ring: 'rgba(192, 38, 211, 0.38)' },
  { id: 'fuchsia', label: '洋红', primary: '#d946ef', soft: 'rgba(217, 70, 239, 0.14)', ring: 'rgba(217, 70, 239, 0.38)' },
  { id: 'rose', label: '玫红', primary: '#f43f5e', soft: 'rgba(244, 63, 94, 0.14)', ring: 'rgba(244, 63, 94, 0.38)' },
  { id: 'coral', label: '珊瑚', primary: '#fb7185', soft: 'rgba(251, 113, 133, 0.14)', ring: 'rgba(251, 113, 133, 0.38)' },
  { id: 'indigo', label: '靛青', primary: '#6366f1', soft: 'rgba(99, 102, 241, 0.14)', ring: 'rgba(99, 102, 241, 0.38)' },
]

export function useJkTheme() {
  const currentId = useState<string>('jk-accent-current', () => 'nuxt')

  const preset = computed(() => {
    return JK_ACCENT_PRESETS.find(p => p.id === currentId.value) ?? JK_ACCENT_PRESETS[0]!
  })

  const rootStyle = computed<CSSProperties>(() => ({
    '--jk-primary': preset.value.primary,
    '--jk-primary-soft': preset.value.soft,
    '--jk-ring': preset.value.ring,
  }))

  function setAccent(id: string) {
    const next = JK_ACCENT_PRESETS.find(p => p.id === id)
    if (!next) return
    currentId.value = next.id
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, next.id)
      }
      catch {
        /* ignore */
      }
    }
  }

  function hydrateFromStorage() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw && JK_ACCENT_PRESETS.some(p => p.id === raw)) {
        currentId.value = raw
      }
    }
    catch {
      /* ignore */
    }
  }

  return {
    currentId,
    preset,
    presets: JK_ACCENT_PRESETS,
    rootStyle,
    setAccent,
    hydrateFromStorage,
  }
}
