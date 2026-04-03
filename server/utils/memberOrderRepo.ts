import type { RowDataPacket } from 'mysql2/promise'
import db from '~~/server/db/index'
import type { MemberVipType } from '~~/shared/types/db/order'
import { OrderStatus } from '~~/shared/types/db/order'

export interface MemberOrderRow extends RowDataPacket {
  id: bigint
  user_id: bigint
  out_trade_no: string
  amount: number
  description: string
  vip_type: 'monthly' | 'yearly'
  trade_state: number
  transaction_id: string | null
}

export async function insertMemberOrder(params: {
  userId: number
  outTradeNo: string
  amountCents: number
  description: string
  vipType: MemberVipType
}): Promise<void> {
  await db.execute(
    `INSERT INTO member_orders (user_id, out_trade_no, amount, description, vip_type, trade_state)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [params.userId, params.outTradeNo, params.amountCents, params.description, params.vipType, OrderStatus.NOTPAY],
  )
}

export async function findMemberOrderByOutTradeNo(outTradeNo: string): Promise<MemberOrderRow | null> {
  const [rows] = await db.query<MemberOrderRow[]>(
    `SELECT id, user_id, out_trade_no, amount, description, vip_type, trade_state, transaction_id
     FROM member_orders
     WHERE out_trade_no = ? AND deleted_at IS NULL
     LIMIT 1`,
    [outTradeNo],
  )
  return rows[0] ?? null
}

export async function updateMemberOrderState(
  outTradeNo: string,
  tradeState: OrderStatus,
  transactionId: string | null,
): Promise<void> {
  await db.execute(
    `UPDATE member_orders
     SET trade_state = ?, transaction_id = COALESCE(?, transaction_id), updated_at = CURRENT_TIMESTAMP(3)
     WHERE out_trade_no = ? AND deleted_at IS NULL`,
    [tradeState, transactionId, outTradeNo],
  )
}

/** 最近一笔支付成功订单的套餐类型（用于个人中心展示当前会员档位） */
export async function findLatestSuccessfulMemberVipType(userId: number): Promise<MemberVipType | null> {
  const [rows] = await db.query<RowDataPacket[] & { vip_type: MemberVipType }[]>(
    `SELECT vip_type FROM member_orders
     WHERE user_id = ? AND deleted_at IS NULL AND trade_state = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, OrderStatus.SUCCESS],
  )
  return rows[0]?.vip_type ?? null
}
