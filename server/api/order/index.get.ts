import { getQuery } from 'h3'
import { ResponseCode } from '~~/shared/types'
import type { OrderPollData } from '~~/shared/types/api/order'
import { OrderStatus } from '~~/shared/types/db/order'
import { UnionResponseResult } from '~~/shared/utils'
import { queryWxOrderStatus } from '~~/server/utils/weixinApi'
import { findMemberOrderByOutTradeNo, updateMemberOrderState } from '~~/server/utils/memberOrderRepo'
import { findUserByEmail, updateUserRole } from '~~/server/utils/userRepo'
import { wxTradeStateToOrderStatus } from '~~/server/utils/wxTradeState'
import { UserRole } from '~~/shared/types/db/user'

export default defineEventHandler(async (event) => {
  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    return UnionResponseResult(null as unknown as OrderPollData, '请先登录', ResponseCode.Unauthorized)
  }

  const q = getQuery<{ out_trade_no?: string }>(event)
  const out_trade_no = String(q.out_trade_no ?? '').trim()
  if (!out_trade_no) {
    return UnionResponseResult(null as unknown as OrderPollData, '缺少订单号', ResponseCode.BadRequest)
  }

  const user = await findUserByEmail(jwt.email)
  if (!user) {
    return UnionResponseResult(null as unknown as OrderPollData, '用户不存在', ResponseCode.NotFound)
  }

  const local = await findMemberOrderByOutTradeNo(out_trade_no)
  if (!local || Number(local.user_id) !== Number(user.id)) {
    return UnionResponseResult(null as unknown as OrderPollData, '订单不存在', ResponseCode.NotFound)
  }

  try {
    const wx = await queryWxOrderStatus({ out_trade_no })
    const orderStatus = wxTradeStateToOrderStatus(wx.trade_state)

    if (orderStatus === OrderStatus.SUCCESS) {
      await updateMemberOrderState(out_trade_no, OrderStatus.SUCCESS, wx.transaction_id ?? null)
      await updateUserRole(Number(user.id), UserRole.Vip)
    } else if (orderStatus === OrderStatus.NOTPAY || orderStatus === OrderStatus.USERPAYING) {
      await updateMemberOrderState(out_trade_no, orderStatus, null)
    } else {
      await updateMemberOrderState(out_trade_no, orderStatus, wx.transaction_id ?? null)
    }

    return UnionResponseResult<OrderPollData>(
      {
        orderStatus,
        trade_state: wx.trade_state,
        trade_state_desc: wx.trade_state_desc,
        out_trade_no: wx.out_trade_no,
      },
      'ok',
    )
  } catch (e) {
    console.error('[order] queryWxOrderStatus failed', e)
    return UnionResponseResult<OrderPollData>(
      {
        orderStatus: OrderStatus.NOTPAY,
        trade_state: 'NOTPAY',
        trade_state_desc: '查询中',
        out_trade_no,
      },
      '查询中',
    )
  }
})
