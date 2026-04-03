/**
 * 仅客户端校验登录态（token 由 auth-persist 插件从 localStorage 恢复后再判断）。
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const auth = useAuthUser()
  if (!auth.value?.token) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
