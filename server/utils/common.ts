import * as fs from 'fs'
import * as path from 'path'

/** ------------------------- 微信支付模块相关函数 ------------------------- */

/**
 * 加载私钥文件
 * @param pemPath 私钥路径：建议相对「进程工作目录」（一般为项目根，与 .env 同级），如 `wxcert/apiclient_key.pem`；或填绝对路径（云上推荐）
 */
export function loadPrivateKey(pemPath: string): string {
  const absolutePath = path.isAbsolute(pemPath)
    ? pemPath
    : path.resolve(process.cwd(), pemPath)
  const key = fs.readFileSync(absolutePath, 'utf8')
  return key
}
