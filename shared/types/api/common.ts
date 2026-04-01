import type { MusicDetailItem, SearchMusicList } from '~~/shared/types'

/** 与 HTTP 状态对齐的业务码；业务层优先读 code，再读 message */
export enum ResponseCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  ServerError = 500,
}

/** 统一 API 响应（ Nitro / $fetch 均使用此结构 ） */
export type UnionResponse<T> = {
  code: ResponseCode
  message: string
  data: T
}

export type MusicSearchResponse = UnionResponse<SearchMusicList>
export type MusicDetailResponse = UnionResponse<MusicDetailItem>
