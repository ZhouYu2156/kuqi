export enum ResponseCode {
  Success = 200,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

// 统一后端响应数据结构
export type UnionResponse<T> = {
  code: number
  message: string
  data: T
}

export type MusicItem = {
  SQFileHash: string
  PublishTime: string
  Audioid: number
  SuperDuration: number
  OldCpy: number
  PublishAge: number
  bitflag: number
  HQBitrate: number
  PayType: number
  Accompany: number
  SingerName: string
  HQPrivilege: number
  TopicRemark: string
  OriOtherName: string
  ShowingFlag: number
  Source: string
  SQFileSize: number
  AlbumAux: string
  HQDuration: number
  Image: string
  HQPayType: number
  EMixSongID: string
  M4aSize: number
  HeatLevel: number
  SQPkgPrice: number
  UploaderContent: string
  FileSize: number
  IsOriginal: number
  FileHash: string
  ID: string
  isPrepublish: number
  EAlbumID: string
  MvTrac: number
  ASQPrivilege: number
  Type: string
  Bitrate: number
  SQPrice: number
  TopID: number
  ExtName: string
  AlbumPrivilege: number
  AlbumID: string
  AlbumName: string
  Category: number
  SuperExtName: string
  vvid: string
  OtherName: string
  SongName: string
  AudioCdn: number
  SourceID: number
  SQDuration: number
  HQFileSize: number
  MixSongID: string
  HQPkgPrice: number
  SQPayType: number
  SuperBitrate: number
  FailProcess: number
  HQPrice: number
  Suffix: string
  HQFailProcess: number
  MvType: number
  ResDuration: number
  ResBitrate: number
  HiFiQuality: number
  ResFileHash: string
  SingerId: number[]
  SongLabel: string
  HQExtName: string
  HasAlbum: number
  MatchFlag: number
  Scid: number
  SuperFileHash: string
  QualityLevel: number
  mvTotal: number
  MvHash: string
  SuperFileSize: number
  Auxiliary: string
  SQExtName: string
  SQBitrate: number
  RankId: number
  PublishDate: string
  HQFileHash: string
  TopicUrl: string
  TagDetails: any[]
  TagContent: string
  Privilege: number
  PkgPrice: number
  OwnerCount: number
  Uploader: string
  Duration: number
  SQFailProcess: number
  OriSongName: string
  A320Privilege: number
  FileName: string
  ResFileSize: number
  SQPrivilege: number
  Price: number
  recommend_type: number
  Publish: number
}

// 单首音乐数据结构
export type MusicDetailItem = {
  hash: string
  timelength: number
  filesize: number
  audio_name: string
  have_album: number
  album_name: string
  album_id: string
  img: string
  sizable_cover: string
  have_mv: number
  video_id: number
  author_name: string
  song_name: string
  lyrics: string
  author_id: string
  privilege: number
  privilege2: string
  play_url: string
  authors: {
    author_id: string
    author_name: string
    is_publish: string
    sizable_avatar: string
    e_author_id: string
    avatar: string
  }[]
  is_free_part: number
  bitrate: number
  recommend_album_id: number
  store_type: string
  album_audio_id: number
  is_publish: number
  e_author_id: string
  audio_id: string
  has_privilege: boolean
  play_backup_url: string
  trans_param: {
    cpy_grade: number
    classmap: {
      attr0: number
    }
    language: string
    cpy_attr0: number
    musicpack_advance: number
    ogg_128_filesize: number
    display_rate: number
    cpy_level: number
    pay_block_tpl: number
    qualitymap: {
      bits: string
      attr0: number
      attr1: number
    }
    hash_multitrack: string
    hash_offset: {
      clip_hash: string
      start_byte: number
      end_ms: number
      end_byte: number
      file_type: number
      start_ms: number
      offset_hash: string
    }
    cid: number
    display: number
    ogg_320_hash: string
    ipmap: {
      attr0: number
    }
    appid_block: string
    ogg_128_hash: string
    union_cover: string
    ogg_320_filesize: number
  }
  small_library_song: number
  encode_album_id: string
  encode_album_audio_id: string
  e_video_id: string
}

export type SearchMusicList = {
  lists: MusicItem[]
  total: number
  page: number
  pagesize: number
}

export type MusicSearchResponse = UnionResponse<SearchMusicList>
