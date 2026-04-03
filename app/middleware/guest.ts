/**
 * 访客专用：已登录用户不应访问登录/注册页（token 由 auth-persist 在客户端恢复后再判断）。
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const auth = useAuthUser()
  if (auth.value?.token) {
    return navigateTo('/dashboard')
  }
})
