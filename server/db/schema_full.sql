-- =============================================================================
-- 极客兔 · 数据库全量建表脚本（由 server/db/migrations/*.sql 合并）
-- 适用：MySQL 8.0+ / InnoDB / utf8mb4
--
-- 部署示例：
--   mysql -u YOUR_USER -p YOUR_DATABASE < server/db/schema_full.sql
--
-- 说明：
-- - 已合并 001_users + 002_users_password + 003_users_sex
-- - 已合并 002_member_orders + 005_member_orders_vip_type
-- - email_otps 见 004_email_otps
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. users（用户）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL COMMENT '登录名',
  `email` VARCHAR(255) NOT NULL COMMENT '邮箱',
  `password_hash` VARCHAR(255) NULL DEFAULT NULL COMMENT 'bcrypt 密码哈希',
  `phone` VARCHAR(32) NULL DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(512) NULL DEFAULT NULL COMMENT '头像 URL',
  `sex` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0未知 1男 2女',
  `role` VARCHAR(16) NOT NULL DEFAULT 'user' COMMENT 'admin | user | vip',
  `status` VARCHAR(16) NOT NULL DEFAULT 'inactive' COMMENT 'active | inactive | locked | disabled',
  `last_login_at` DATETIME(3) NULL DEFAULT NULL COMMENT '最近登录时间',
  `last_login_ip` VARCHAR(45) NULL DEFAULT NULL COMMENT '最近登录 IP（含 IPv6）',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` DATETIME(3) NULL DEFAULT NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户';

-- -----------------------------------------------------------------------------
-- 2. member_orders（会员订单，依赖 users.id）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `member_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户 ID',
  `out_trade_no` VARCHAR(64) NOT NULL COMMENT '商户系统内部订单号',
  `amount` INT UNSIGNED NOT NULL COMMENT '订单金额，单位：分',
  `description` VARCHAR(512) NOT NULL DEFAULT '' COMMENT '订单描述',
  `vip_type` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly' COMMENT '会员套餐：monthly 月度 / yearly 年度',
  `trade_state` TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1成功 2退款 3未支付 4关闭 5撤销 6支付中 7失败',
  `transaction_id` VARCHAR(64) NULL DEFAULT NULL COMMENT '微信支付订单号',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` DATETIME(3) NULL DEFAULT NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_member_orders_out_trade_no` (`out_trade_no`),
  KEY `idx_member_orders_user_id` (`user_id`),
  KEY `idx_member_orders_trade_state` (`trade_state`),
  KEY `idx_member_orders_created_at` (`created_at`),
  KEY `idx_member_orders_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_member_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员订单';

-- -----------------------------------------------------------------------------
-- 3. email_otps（邮箱验证码）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `email_otps` (
  `email` VARCHAR(255) NOT NULL,
  `code_hash` CHAR(64) NOT NULL COMMENT 'SHA256 hex',
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮箱验证码';

SET FOREIGN_KEY_CHECKS = 1;
