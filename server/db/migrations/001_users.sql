-- 用户表：登录、角色与会员（知识付费 / 视频课 / 音乐额度）
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt',
  role ENUM('guest', 'user', 'vip', 'admin') NOT NULL DEFAULT 'user',
  membership_until DATETIME NULL COMMENT '会员权益截止时间',
  membership_plan ENUM('monthly', 'annual') NULL COMMENT '当前合约档位',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 示例：密码为 demo123 的 bcrypt 哈希（请自行替换邮箱后执行，或删除此行）
-- INSERT INTO users (email, password_hash, role) VALUES (
--   'demo@local.dev',
--   '$2b$10$YourBcryptHashHereReplaceWithRealHash',
--   'user'
-- );
