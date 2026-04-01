import type { UnionResponse } from './common'

export type OrderCreateBody = {
  appid: string // 小程序APPID
  mchid: string // 商户号
  description: string // 商品描述
  out_trade_no: string // 商户订单号: 订单唯一标识
  attach: string // 订单附加说明
  notify_url: string // 通知地址
  goods_tag: string // 商品标记
  support_fapiao: boolean // 是否支持发票
  amount: {
    total: number // 订单总金额
    currency: string // 货币类型
  }
  detail: {
    cost_price: number // 商品消费价格
    invoice_id: string // 发票ID
    goods_detail: [
      {
        merchant_goods_id: string // 商户商品ID
        wechatpay_goods_id: string // 微信支付商品ID
        goods_name: string // 商品名称
        quantity: number // 商品数量
        unit_price: number // 商品单价
      },
    ]
  }
  scene_info: {
    payer_client_ip: string // 用户端IP地址
    device_id: string // 设备ID
    store_info: {
      id: string // 门店ID
      name: string // 门店名称
      area_code: string // 门店地区编码
      address: string // 门店地址
    }
  }
  settle_info: {
    profit_sharing: boolean // 是否分账
  }
}

export type OrderCreateResponse = UnionResponse<{}>
