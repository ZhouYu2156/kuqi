import { getRequestURL } from 'h3'
import { insertMemberOrder } from '~~/server/utils/memberOrderRepo'
import { findUserByEmail } from '~~/server/utils/userRepo'
import { createWxOrder } from '~~/server/utils/weixinApi'
import { MEMBERSHIP_PRICE_CENTS } from '~~/shared/constants/membership'
import { ResponseCode } from '~~/shared/types'
import type { CreateMemberOrderBody, CreateMemberOrderData } from '~~/shared/types/api/order'
import { MemberVipType } from '~~/shared/types/db/order'
import { UnionResponseResult } from '~~/shared/utils'

function isVipType(v: unknown): v is MemberVipType {
  return v === MemberVipType.Monthly || v === MemberVipType.Yearly
}

export default defineEventHandler(async (event) => {
  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    return UnionResponseResult(null as unknown as CreateMemberOrderData, '请先登录', ResponseCode.Unauthorized)
  }

  const body = await readBody<CreateMemberOrderBody>(event)
  if (!isVipType(body?.vip_type)) {
    return UnionResponseResult(null as unknown as CreateMemberOrderData, '请选择会员类型', ResponseCode.BadRequest)
  }

  const user = await findUserByEmail(jwt.email)
  if (!user) {
    return UnionResponseResult(null as unknown as CreateMemberOrderData, '用户不存在', ResponseCode.NotFound)
  }

  const amountCents = MEMBERSHIP_PRICE_CENTS[body.vip_type]
  const description = body.vip_type === MemberVipType.Yearly ? '极客兔·年度会员' : '极客兔·月度会员'

  const origin = getRequestURL(event).origin
  const notify_url = `${origin}/api/order/wx-notify`

  try {
    const wx = await createWxOrder({
      description,
      notify_url,
      amount: { total: amountCents },
    })

    await insertMemberOrder({
      userId: Number(user.id),
      outTradeNo: wx.out_trade_no,
      amountCents,
      description,
      vipType: body.vip_type,
    })

    return UnionResponseResult<CreateMemberOrderData>(
      {
        code_url: wx.code_url,
        out_trade_no: wx.out_trade_no,
        amount: amountCents,
        description,
        vip_type: body.vip_type,
      },
      '订单已创建，请扫码支付',
    )
  } catch (e) {
    console.error('[order] createWxOrder failed', e)
    return UnionResponseResult(
      null as unknown as CreateMemberOrderData,
      '创建支付订单失败，请稍后重试',
      ResponseCode.ServerError,
    )
  }
})
