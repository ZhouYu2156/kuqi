import { watch } from 'vue'
import type { AuthUserPayload } from '~~/shared/types/api/auth'

/** localStorage 键名，勿与业务其他键冲突 */
export const AUTH_STORAGE_KEY = 'jiketu:auth'

export type AuthSession = {
  token: string | null
  user: AuthUserPayload | null
}

function parseStored(): AuthSession | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as unknown
    if (!data || typeof data !== 'object') return null
    const token = (data as { token?: unknown }).token
    if (typeof token !== 'string' || !token) return null
    const user = (data as { user?: unknown }).user
    return {
      token,
      user: user && typeof user === 'object' ? (user as AuthUserPayload) : null,
    }
  } catch {
    return null
  }
}

function writeStored(session: AuthSession): void {
  if (!import.meta.client) return
  try {
    if (!session.token) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    }
  } catch {
    // 存储配额、隐私模式等
  }
}

/**
 * 登录态（token + user），与登录/注册接口返回结构一致。
 * 仅在客户端从 localStorage 恢复，并 deep watch 写回；`useApi` 等处的 `Authorization` 会随响应式更新。
 */
export function useAuthUser() {
  const state = useState<AuthSession>('auth', () => ({
    token: null,
    user: null,
  }))

  const persistReady = useState('auth-persist-ready', () => false)

  if (import.meta.client && !persistReady.value) {
    persistReady.value = true
    const stored = parseStored()
    if (stored) {
      state.value = stored
    }
    watch(
      state,
      (v) => {
        writeStored(v)
      },
      { deep: true },
    )
  }

  return state
}

/** 退出登录：清空内存与 localStorage */
export function clearAuthSession() {
  const auth = useAuthUser()
  auth.value = { token: null, user: null }
}
