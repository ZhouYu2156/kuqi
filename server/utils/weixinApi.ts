import { config } from 'dotenv'
import crypto from 'node:crypto'
import type { CreateWxOrderParams } from '~~/server/types'
import { loadPrivateKey } from '~~/server/utils/common'

config()

// 参考文档：https://pay.weixin.qq.com/doc/v3/merchant/4012365336

/**
 * 生成带有微信支付必须签名的 Authorization 字段
 */
function constructAuthorization({
  method = 'POST',
  url = '/v3/pay/transactions/native',
  body = '',
  mchid = process.env.WX_MCHID,
  serial = process.env.WX_SERIAL,
  privateKeyPath = process.env.WX_PRIVATE_KEY_PATH as string,
}: {
  method?: string
  mchid?: string
  url?: string
  serial?: string
  privateKeyPath?: string
  body?: string
}) {
  // 加载私钥
  const privateKey = loadPrivateKey(privateKeyPath)

  // 步骤 1-4: 构造待签名字符串
  // 微信支付要求每个字段后面都有 \n
  // HTTP请求方法\n
  // URL\n
  // 请求时间戳\n
  // 请求随机串\n
  // 请求报文主体\n
  const timestamp = Date.now()
  const nonceStr = crypto.randomBytes(16).toString('hex')
  const bodyStr = body && typeof body === 'object' ? JSON.stringify(body) : body
  const message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${bodyStr}\n`

  // 步骤 5：计算签名值
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(message)
  signer.end()
  // PEM 私钥文件内容格式要对
  const signature = signer.sign(privateKey, 'base64')

  // 步骤 6：拼接Authorization
  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",serial_no="${serial}",nonce_str="${nonceStr}",timestamp="${timestamp}",signature="${signature}"`

  return authorization
}

/**
 * 创建微信订单, 生成支付链接, 前端需要自行将支付链接转换为二维码供别人微信扫码支付
 * @returns
 */
export async function createWxOrder(options: CreateWxOrderParams) {
  // 1. 创建微信支付订单
  const createWxOrderApi = 'https://api.mch.weixin.qq.com/v3/pay/transactions/native'

  // 内部自动生成商户订单号, 无需传入
  const outTradeNo = generateTradeNo()

  // 必传参数
  const body: CreateWxOrderParams = {
    appid: process.env.WX_APPID as string, // 小程序APPID
    mchid: process.env.WX_MCHID as string, // 商户号
    description: options.description, // 商品描述
    out_trade_no: outTradeNo, // 商户订单号: 订单唯一标识
    notify_url: options.notify_url, // 通知前端回调地址
    amount: {
      total: options.amount.total, // 商品金额
    },
  }

  // 创建 Authorization 认证标识
  const authorization = constructAuthorization({ body: JSON.stringify(body) })

  // 添加到请求头中
  const headers = {
    Authorization: authorization,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  // 请求 微信支付 下单 => 返回支付二维码的链接, 需要自行转换为二维码展示给用户微信扫码
  const response = await $fetch<{ code_url: string }>(createWxOrderApi, {
    method: 'POST',
    headers,
    body,
  })

  return response
}

/**
 * 由于不知道用户有没有支付，故使用商户订单号向微信查询订单状态，只有支付成功，才可以使用微信订单号查询订单状态
 * @param opts { out_trade_no: string } 商户订单号
 * @returns 订单信息
 */
export async function queryWxOrderStatus(opts: { out_trade_no: string }) {
  // 目标地址, 【商户订单号】 商户下单时传入的商户系统内部订单号。
  const queryWxOrderApi = `/v3/pay/transactions/out-trade-no/${opts.out_trade_no}`
  const targetUrl = `https://api.mch.weixin.qq.com${queryWxOrderApi}`

  /**
   * 请求方法: GET
   *
   * 请求参数
   *   Authorization: 请求参数里带Path参数（路径参数），如何计算签名: 参考https://pay.weixin.qq.com/doc/v3/merchant/4012365334
   *   transaction_id: 微信支付订单号
   */
  const authorization = constructAuthorization({
    url: queryWxOrderApi,
    method: 'GET',
    body: '',
  })

  const headers = {
    Authorization: authorization,
    Accept: 'application/json',
  }

  const response = await $fetch(targetUrl, {
    method: 'GET',
    headers,
  })

  return response
}
