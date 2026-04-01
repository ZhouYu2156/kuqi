# 极客兔官网

## 项目目标

由于现在市面上的技术课程昂贵，视频质量却不高，本站核心服务旨在以极低的价格提供优质的技术教程和稀缺资源为目标，帮助大家享受更好的资源服务。

## 网站整体风格

网页风格与 Nuxt 官网类似，整体布局分为上中下，顶部导航栏分为 左(Logo) + 中(导航选项) + 右(调色面板和个人社交图标，调色面板有亮色/暗色模式切换、网站主色切换)，中间是页面的主要内容，底部页脚为版权信息。

## 项目要求

从大方向上架构整个项目，包括认证系统、主题扩展、响应式设计等，要综合考虑，项目极具灵活性，后期可以根据需要随时注入新的主题或功能的拓展。
项目符合最佳实践，具备很好的阅读性和可维护性。

## 项目模块

- 首页
- 即刻听
- 优质教程
- 登录

## 技术栈

- Nuxt 4 全栈：app/（页面、布局、组件、插件、中间件）、server/（Nitro API）、shared/（前后端共用类型与少量工具）。
- UI：@nuxt/ui v4 + Tailwind v4 + Element Plus。
- 内容：@nuxt/content（博客等）。
- 数据：MySQL（server/lib/db.ts），另有 SQLite/better-sqlite 依赖（可能用于 OTP 等，需与 MySQL 职责分清）。
- 鉴权：JWT

## 开发规范说明

1. 每个组件使用 `<script setup lang='ts'></script>`、`<template></template>`、`<style scoped lang='scss'></style>` 的结构顺序
2. 前端 UI 一定要尽量使用 Nuxt UI v4 + TailwindCSS v4 编写属于自己的业务组件
3. 适当的时候，可以使用 Element Plus 组件简化 UI 构建的工作量
4. 组件封装要合理拆分功能与职责，符合最佳实践，每个文件不能超过 300 行代码
5. 统一规范请求和响应格式，定义响应状态码 ResponseCode，和统一响应数据结构类型 UnionResponse<T>，做好统一请求成功或错误处理设计
6. 项目结构和代码具备良好的可扩展性和可维护性
7. API 风格统一，仅在 api 文件夹下创建接口，不要在 routes 目录下
8. 前后端通用功能函数或变量，放在共享文件夹中
9. 遵循 Nuxt v4 约定式结构规范
10. 前后端都要设置鉴权系统，明确哪些接口不需要鉴权，哪些接口需要鉴权
11. 所有业务组件统一使用 JTK 前缀命名，例如 JKTMusicList

## 项目 API 接口说明

- 基础域名: `http://localhost:3000`

- 统一相应结构:

```ts
enum ResponseCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  ServerError = 500,
}

type UnionResponse<T> = {
  code: ResponseCode
  message: string
  data: T
}
```

### 音乐模块

类型定义

```ts
/**
 * 音乐搜索获取到的歌曲的关键数据结构
 */
export type MusicItem = {
  SingerName: string // 歌手名
  EMixSongID: string // 混淆歌曲ID
  ExtName: string // 扩展名
  SongName: string // 歌曲名
  PublishDate: string // 发布日期
  OriSongName: string // 原始歌曲名
  FileName: string // 文件名
}

/**
 * 单首音乐数据结构
 */
export type MusicDetailItem = {
  hash: string // 歌曲 hash 值
  timelength: number // 歌曲时长 单位: 毫秒
  author_name: string // 作者名称
  song_name: string // 歌曲名
  album_name: string // 专辑名称
  audio_name: string // 音频名称 -> 包括歌手名与歌手名的全称: 歌手 - 歌曲名
  img: string // 歌曲封面
  lyrics: string // 歌词
  play_url: string // 歌曲资源地址
  play_backup_url: string // 歌曲资源备用地址
  encode_album_audio_id: string // 混淆歌曲 ID => 与 EMixSongID 对应, 用 EMixSongID 获取音乐详情数据
}

/**
 * 自定义搜索音乐时，后端返回的数据结构
 */
export type SearchMusicList = {
  lists: MusicItem[]
  total: number
  page: number
  pagesize: number
}
```

#### 音乐搜索

路径: `/api/music/`

请求方法: `GET`

查询参数:

- keyword: 关键词
- page: 页码
- pagesize: 分页大小

返回结果：

```ts
type MusicSearchResponse = UnionResponse<SearchMusicList>
```

注意事项：page、pagesize 必须是数字

#### 音乐详情

路径: `/api/detail/`

请求方法: `GET`

查询参数:

- audioId: 音频ID（是音乐搜索结果项的 EMixSongID 字段）

返回结果：

```ts
type MusicDetailResponse = UnionResponse<MusicDetailItem>
```

注意事项：audioId 是随机字母与数字组成的字符串
