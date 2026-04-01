export default defineNuxtRouteMiddleware(async (to) => {
  const { user, refresh } = useAuth()
  if (!user.value) {
    await refresh()
  }
  if (user.value?.role === 'admin') {
    return
  }
  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  })
})
