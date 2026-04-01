import type { AuthUser } from '~~/shared/types/auth'
import { ResponseCode, type UnionResponse } from '~~/shared/types/common'

type MeData = { user: AuthUser }
type LoginData = { user: AuthUser; token?: string }

export function useAuth() {
  const user = useState<AuthUser | null>('jk-auth-user', () => null)
  const pending = useState('jk-auth-pending', () => false)

  async function refresh() {
    pending.value = true
    try {
      const res = await $fetch<UnionResponse<MeData | null>>('/api/auth/me', {
        credentials: 'include',
      })
      if (res.code === ResponseCode.Success && res.data?.user) {
        user.value = res.data.user
      }
      else {
        user.value = null
      }
    }
    catch {
      user.value = null
    }
    finally {
      pending.value = false
    }
  }

  async function login(email: string, password: string) {
    const res = await $fetch<UnionResponse<LoginData>>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    if (res.code === ResponseCode.Success && res.data?.user) {
      user.value = res.data.user
    }
    return res
  }

  async function logout() {
    await $fetch<UnionResponse<{ done: boolean }>>('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    user.value = null
  }

  async function register(email: string, password: string, code: string) {
    const res = await $fetch<UnionResponse<LoginData>>('/api/auth/register', {
      method: 'POST',
      body: { email, password, code },
      credentials: 'include',
    })
    if (res.code === ResponseCode.Success && res.data?.user) {
      user.value = res.data.user
    }
    return res
  }

  return {
    user,
    pending,
    refresh,
    login,
    logout,
    register,
  }
}
