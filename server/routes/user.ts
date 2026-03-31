import db from '~~/server/lib/db'

export default defineEventHandler(async (event) => {
  const [rows, fields] = await db.query('select * from users;')

  return { data: rows }
})
