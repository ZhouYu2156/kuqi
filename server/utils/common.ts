import * as fs from 'fs'
import * as path from 'path'

/** ------------------------- 微信支付模块相关函数 ------------------------- */

/**
 * 加载私钥文件
 * @param pemPath 私钥.pem文件路径
 * @returns 私钥内容字符串
 */
export function loadPrivateKey(pemPath: string): string {
  // Windows下import.meta.url为file:///E:/...，路径多出一个开头的/，需要处理，否则找不到文件
  let dirname = path.dirname(new URL(import.meta.url).pathname)
  if (process.platform === 'win32' && dirname.startsWith('/')) {
    dirname = dirname.slice(1)
  }
  const absolutePath = path.resolve(dirname, pemPath)
  const key = fs.readFileSync(absolutePath, 'utf8')
  return key
}
