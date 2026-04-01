-- 会员/微信相关订单表（字段对齐 shared/types/db/order.ts MemberOrder + CommonFields）
-- 依赖 001_users.sql 已执行
-- MySQL 8+ / InnoDB / utf8mb4

CREATE TABLE IF NOT EXISTS `member_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户 ID',
  `out_trade_no` VARCHAR(64) NOT NULL COMMENT '商户系统内部订单号',
  `amount` INT UNSIGNED NOT NULL COMMENT '订单金额，单位：分',
  `description` VARCHAR(512) NOT NULL DEFAULT '' COMMENT '订单描述',
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
