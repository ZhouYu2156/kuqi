import { getQuery } from 'h3'
import type { RowDataPacket } from 'mysql2/promise'
import db from '~~/server/db/index'
import { findUserByEmail } from '~~/server/utils/userRepo'
import { ResponseCode } from '~~/shared/types'
import type { UserOrdersData } from '~~/shared/types/api/order'
import { UnionResponseResult } from '~~/shared/utils'

const DEFAULT_PAGE_SIZE = 5
const MAX_PAGE_SIZE = 50

interface MemberOrderRow extends RowDataPacket {
  id: bigint
  out_trade_no: string
  amount: number
  description: string
  vip_type: 'monthly' | 'yearly'
  trade_state: number
  transaction_id: string | null
  created_at: Date
}

export default defineEventHandler(async (event) => {
  const jwt = event.context.auth?.jwt
  if (!jwt?.email) {
    return UnionResponseResult(null as unknown as UserOrdersData, '未登录', ResponseCode.Unauthorized)
  }

  const user = await findUserByEmail(jwt.email)
  if (!user) {
    return UnionResponseResult(null as unknown as UserOrdersData, '用户不存在', ResponseCode.NotFound)
  }

  const uid = Number(user.id)

  const q = getQuery(event)
  const pageRaw = Number.parseInt(String(q.page ?? '1'), 10)
  const sizeRaw = Number.parseInt(String(q.pageSize ?? String(DEFAULT_PAGE_SIZE)), 10)
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1
  const pageSize = Number.isFinite(sizeRaw)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(sizeRaw)))
    : DEFAULT_PAGE_SIZE

  let countRows: RowDataPacket[]
  let rows: MemberOrderRow[]
  try {
    ;[countRows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS c FROM member_orders WHERE user_id = ? AND deleted_at IS NULL`,
      [uid],
    )
    const offset = (page - 1) * pageSize
    ;[rows] = await db.query<MemberOrderRow[]>(
      `SELECT id, out_trade_no, amount, description, vip_type, trade_state, transaction_id, created_at
       FROM member_orders
       WHERE user_id = ? AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [uid, pageSize, offset],
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[orders.get] DB error:', msg)
    return UnionResponseResult(null as unknown as UserOrdersData, `订单查询失败：${msg}`, ResponseCode.ServerError)
  }

  const total = Number((countRows[0] as { c: number | string } | undefined)?.c ?? 0)

  const list = rows.map((r) => ({
    id: Number(r.id),
    out_trade_no: r.out_trade_no,
    amount: r.amount,
    description: r.description,
    vip_type: r.vip_type,
    trade_state: r.trade_state,
    transaction_id: r.transaction_id,
    created_at: new Date(r.created_at).toISOString(),
  }))

  return UnionResponseResult<UserOrdersData>(
    {
      list,
      total,
      page,
      pageSize,
    },
    'ok',
  )
})
