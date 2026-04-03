import { config } from 'dotenv'
import crypto from 'node:crypto'
import { loadPrivateKey } from '~~/server/utils/common'
import type { CreateWxOrderParams } from '~~/shared/types'
import { queryWxOrderStatusResponse } from '~~/shared/types'
import { generateTradeNo } from '~~/shared/utils'

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
  // 请求时间戳（秒级 Unix 时间戳，与 Authorization 中 timestamp 一致）\n
  // 请求随机串\n
  // 请求报文主体\n
  const timestamp = Math.floor(Date.now() / 1000)
  const nonceStr = crypto.randomBytes(16).toString('hex')
  const bodyStr = typeof body === 'object' && body !== null ? JSON.stringify(body) : String(body ?? '')
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
export async function createWxOrder(options: CreateWxOrderParams): Promise<{ code_url: string; out_trade_no: string }> {
  const createWxOrderApi = 'https://api.mch.weixin.qq.com/v3/pay/transactions/native'

  const outTradeNo = generateTradeNo()

  const body: CreateWxOrderParams = {
    appid: process.env.WX_APPID as string,
    mchid: process.env.WX_MCHID as string,
    description: options.description,
    out_trade_no: outTradeNo,
    notify_url: options.notify_url,
    amount: {
      total: options.amount.total,
    },
  }

  // 与签名使用同一份 JSON 字节，避免 ofetch 序列化与 JSON.stringify 不一致导致 401
  const bodyRaw = JSON.stringify(body)
  const authorization = constructAuthorization({ body: bodyRaw })

  const headers = {
    Authorization: authorization,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const response = await $fetch<{ code_url: string }>(createWxOrderApi, {
    method: 'POST',
    headers,
    body: bodyRaw,
  })

  return {
    code_url: response.code_url,
    out_trade_no: outTradeNo,
  }
}

/**
 * 由于不知道用户有没有支付，故使用商户订单号向微信查询订单状态，只有支付成功，才可以使用微信订单号查询订单状态
 * @param opts { out_trade_no: string } 商户订单号
 * @returns 订单信息
 */
export async function queryWxOrderStatus(opts: { out_trade_no: string }) {
  // 直连商户必传 query：mchid（见 https://pay.weixin.qq.com/doc/v3/merchant/4012791838 ）
  // 签名字符串里的 url 须与真实请求 path + query 完全一致（含 ?mchid=）
  const mchid = process.env.WX_MCHID as string
  const outNo = encodeURIComponent(opts.out_trade_no)
  const queryWxOrderApi = `/v3/pay/transactions/out-trade-no/${outNo}?mchid=${encodeURIComponent(mchid)}`
  const targetUrl = `https://api.mch.weixin.qq.com${queryWxOrderApi}`

  const authorization = constructAuthorization({
    url: queryWxOrderApi,
    method: 'GET',
    body: '',
  })

  const headers = {
    Authorization: authorization,
    Accept: 'application/json',
  }

  const response = await $fetch<queryWxOrderStatusResponse>(targetUrl, {
    method: 'GET',
    headers,
  })

  return response
}
