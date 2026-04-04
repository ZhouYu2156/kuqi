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

/** 清单条目（与 shared/data/treasured-musics.json 一致） */
export type TreasuredManifestItem = {
  id: string
  song_name: string
  author_name: string
  audio: string
  cover: string
  lrc: string
}

/** GET /api/music/treasured 列表项（不含播放地址与歌词正文） */
export type TreasuredListItem = {
  id: string
  song_name: string
  author_name: string
  cover: string
}
