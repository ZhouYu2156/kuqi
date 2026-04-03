/**
 * 尽早初始化 useAuthUser，在页面/中间件执行前从 localStorage 恢复登录态。
 */
export default defineNuxtPlugin(() => {
  useAuthUser()
})
