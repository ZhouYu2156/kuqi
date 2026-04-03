/**
 * 微信支付结果异步通知入口（需配置为商户平台「支付回调 URL」同路径）。
 * 生产环境应验签、解密 resource、幂等更新订单；此处返回 200 占位。
 */
export default defineEventHandler(() => {
  return { code: 'SUCCESS', message: '成功' }
})
