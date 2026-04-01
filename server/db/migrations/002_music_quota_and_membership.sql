-- 自旧版 001（含 creator 角色）升级：先改角色再收紧 ENUM
UPDATE users SET role = 'user' WHERE role = 'creator';

ALTER TABLE users
  MODIFY COLUMN role ENUM('guest', 'user', 'vip', 'admin') NOT NULL DEFAULT 'user';

-- 若尚无 membership_plan 列则添加（已存在会报错，可忽略或拆行执行）
ALTER TABLE users
  ADD COLUMN membership_plan ENUM('monthly', 'annual') NULL
    COMMENT '当前合约档位'
    AFTER membership_until;

-- 每日音乐试听计数（与 server/lib/musicQuota.ts 一致）
CREATE TABLE IF NOT EXISTS user_music_daily (
  user_id BIGINT UNSIGNED NOT NULL,
  play_date DATE NOT NULL,
  play_count INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, play_date),
  CONSTRAINT fk_user_music_daily_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
