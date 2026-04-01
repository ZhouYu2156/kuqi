-- 用户表（字段对齐 shared/types/db/user.ts + CommonFields）
-- MySQL 8+ / InnoDB / utf8mb4

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL COMMENT '登录名',
  `email` VARCHAR(255) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(32) NULL DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(512) NULL DEFAULT NULL COMMENT '头像 URL',
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
