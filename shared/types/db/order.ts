import type { CommonFields } from '~~/shared/types'

/** 会员订单套餐类型（与 member_orders.vip_type 一致） */
export type MemberVipType = 'monthly' | 'yearly'

export const MemberVipType = {
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const satisfies Record<string, MemberVipType>

export enum OrderStatus {
  SUCCESS = 1, // 支付成功
  REFUND = 2, // 转入退款
  NOTPAY = 3, // 未支付
  CLOSED = 4, // 已关闭
  REVOKED = 5, // 已撤销（仅付款码支付会返回）
  USERPAYING = 6, // 用户支付中（仅付款码支付会返回）
  PAYERROR = 7, // 支付失败（仅付款码支付会返回）
}

export interface MemberOrder extends CommonFields {
  user_id: number // 用户ID
  out_trade_no: string // 商户系统内部订单号
  amount: number // 订单金额
  description: string // 订单描述
  /** 会员套餐类型（member_orders.vip_type） */
  vip_type: MemberVipType
  trade_state: OrderStatus // 订单状态
  transaction_id?: string // 微信支付订单号
}

export interface CreateWxOrderParams {
  appid?: string // 【公众账号ID】 => 在自己的服务层预先设置
  mchid?: string // 【商户号】 => 在自己的服务层预先设置
  description: string // 【商品描述】
  out_trade_no?: string // 【商户订单号】商户系统内部订单号: 订单唯一标识 => 在自己的服务层预先设置
  attach?: string // 【商户数据包】
  notify_url: string // 【商户回调地址】商户接收支付成功回调通知的地址，创单时传入
  goods_tag?: string // 【订单优惠标记】
  support_fapiao?: boolean //【电子发票入口开放标识】
  amount: {
    total: number // 【总金额】 订单总金额，单位为分，整型，必须大于0。示例：1元应填写 100
    currency?: string // 【货币类型】符合ISO 4217标准的三位字母代码，固定传：CNY，代表人民币。
  }
  // 【商品详情】 商品详情描述
  detail?: {
    cost_price?: number // 【订单原价】
    invoice_id?: string // 【商品小票ID】 商家小票ID
    // 【单品列表】 订单商品明细列表，至少传入1条
    goods_detail?: [
      {
        merchant_goods_id: string // 【商户侧商品编码】
        wechatpay_goods_id?: string // 【微信支付商品编码】
        goods_name?: string // 【商品名称】 商品的实际名称
        quantity: number // 【商品数量】 用户购买的数量
        unit_price: number //  【商品单价】整型，单位为：分。
      },
    ]
  }
  // 【场景信息】 场景信息
  scene_info?: {
    payer_client_ip: string // 【用户终端IP】 用户的客户端IP
    device_id?: string // 【商户端设备号】 商户端设备号（门店号或收银设备ID）。
    // 【商户门店信息】 商户门店信息
    store_info?: {
      id: string // 【门店编号】商户侧门店编号，总长度不超过32字符，由商户自定义。
      name?: string // 【门店名称】 商户侧门店名称，由商户自定义。
      area_code?: string // 【地区编码】 地区编码
      address?: string // 【详细地址】 详细的商户门店地址，由商户自定义。
    }
  }
  // 【结算信息】 结算信息
  settle_info?: {
    profit_sharing?: boolean // 【分账标识】订单的分账标识在下单时设置
  }
}
