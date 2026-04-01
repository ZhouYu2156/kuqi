import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { generateTradeNo } from '~~/shared/utils'

/**
 * 加载私钥文件
 * @param pemPath 私钥.pem文件路径
 * @returns 私钥内容字符串
 */
function loadPrivateKey(pemPath: string): string {
  // Windows下import.meta.url为file:///E:/...，路径多出一个开头的/，需要处理，否则找不到文件
  let dirname = path.dirname(new URL(import.meta.url).pathname)
  if (process.platform === 'win32' && dirname.startsWith('/')) {
    dirname = dirname.slice(1)
  }
  const absolutePath = path.resolve(dirname, pemPath)
  const key = fs.readFileSync(absolutePath, 'utf8')
  return key
}

// 参考文档：https://pay.weixin.qq.com/doc/v3/merchant/4012365336
/**
 * 生成带有签名的 Authorization 字段
 * @returns {Promise<string>} Authorization header 字符串
 */
function createRequestSignature({
  method = 'POST',
  mchid = '1740799116',
  url = '/v3/pay/transactions/native',
  serial = '28E9FBE196920020D948D6AB14B9AF2BC310155C',
  privateKeyPath = '../../wxcert/apiclient_key.pem',
  body = '',
} = {}) {
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
  console.log('nonceStr: ', nonceStr)
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

async function createWxOrder() {
  // 1. 创建微信支付订单
  const createWxOrderApi = 'https://api.mch.weixin.qq.com/v3/pay/transactions/native'
  const outTradeNo = generateTradeNo()
  console.log('outTradeNo: ', outTradeNo)
  const body = {
    appid: 'wx769759c9aed50e3c', // 小程序APPID
    mchid: '1740799116', // 商户号
    description: '极客兔会员套餐', // 商品描述
    out_trade_no: outTradeNo, // 商户订单号: 订单唯一标识
    attach: '订单附加说明',
    notify_url: 'https://www.weixin.qq.com/wxpay/pay.php', // 通知地址
    goods_tag: 'WXG', // 商品标记
    support_fapiao: false,
    amount: {
      total: 1,
      currency: 'CNY',
    },
    detail: {
      cost_price: 1,
      invoice_id: '极客兔的小票ID',
      goods_detail: [
        {
          merchant_goods_id: '1246464644',
          wechatpay_goods_id: '1001',
          goods_name: 'iPhoneX 256G',
          quantity: 1,
          unit_price: 1,
        },
      ],
    },
    scene_info: {
      payer_client_ip: '14.23.150.211',
      device_id: '013467007045764',
      store_info: {
        id: '0001',
        name: '腾讯大厦分店',
        area_code: '440305',
        address: '广东省深圳市南山区科技中一道10000号',
      },
    },
    settle_info: {
      profit_sharing: false,
    },
  }

  const authorization = createRequestSignature({ body: JSON.stringify(body) })
  console.log('authorization: ', authorization)
  const headers = {
    Authorization: authorization,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const response = await $fetch(createWxOrderApi, {
    method: 'POST',
    headers,
    body,
  })

  console.log('response: ', JSON.stringify(response, null, 2))
}

export default defineEventHandler(async (event) => {
  await createWxOrder()
  return 'Hello world!'
})
