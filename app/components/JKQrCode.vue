<script setup lang="ts">
import type { OrderStatus } from '~~/shared/types'

defineProps<{
  qrCode: string
  status: OrderStatus
}>()
</script>

<template>
  <div class="qr-code-container">
    <!-- 二维码图片 -->
    <div class="qr-code-wrapper">
      <img
        :src="qrCode"
        alt="支付二维码"
        class="qr-code-image" />

      <!-- 扫描动画 -->
      <div
        v-if="status === OrderStatus.NOTPAY"
        class="scan-animation">
        <!-- 扫描线 -->
        <div class="scan-line"></div>
        <!-- 四个角的装饰 -->
        <div class="scan-corner top-left"></div>
        <div class="scan-corner top-right"></div>
        <div class="scan-corner bottom-left"></div>
        <div class="scan-corner bottom-right"></div>
      </div>

      <!-- 已扫描遮罩 -->
      <div
        v-else-if="status === OrderStatus.SUCCESS"
        class="scanned-overlay">
        <div class="scanned-content">
          <UIcon
            name="i-lucide-check"
            class="check-icon size-10" />
          <span>已扫码</span>
        </div>
      </div>

      <!-- 支付中遮罩 -->
      <div
        v-else-if="status === OrderStatus.USERPAYING"
        class="paying-overlay">
        <div class="paying-content">
          <div class="loading-spinner" />
          <span>正在支付...</span>
        </div>
      </div>
    </div>

    <!-- 状态提示文本 -->
    <p class="status-text">
      {{
        status === OrderStatus.NOTPAY
          ? '请使用手机扫描二维码'
          : status === OrderStatus.SUCCESS
            ? '请在手机上确认支付'
            : status === OrderStatus.USERPAYING
              ? '正在处理支付...'
              : '支付失败'
      }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.qr-code-container {
  @apply flex flex-col items-center;
}

.qr-code-wrapper {
  @apply relative w-64 h-64 bg-white rounded-lg shadow-md overflow-hidden;
}

.qr-code-image {
  @apply w-full h-full object-contain;
}

// 扫描动画容器
.scan-animation {
  @apply absolute inset-0;
  pointer-events: none;
}

// 扫描线
.scan-line {
  @apply absolute top-0 h-full;
  width: 120px; // 扫描线宽度
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(59, 130, 246, 0.05) 20%,
    rgba(59, 130, 246, 0.2) 50%,
    rgba(59, 130, 246, 0.05) 80%,
    transparent 100%
  );
  animation: scanMove 2.5s ease-in-out infinite;
}

// 四个角的装饰
.scan-corner {
  @apply absolute w-8 h-8;
  border-color: #3b82f6;
  border-style: solid;
  border-width: 2px;
  opacity: 0.8;
  animation: cornerFade 2.5s ease-in-out infinite;
}

.top-left {
  @apply top-2 left-2;
  border-right: 0;
  border-bottom: 0;
}

.top-right {
  @apply top-2 right-2;
  border-left: 0;
  border-bottom: 0;
}

.bottom-left {
  @apply bottom-2 left-2;
  border-right: 0;
  border-top: 0;
}

.bottom-right {
  @apply bottom-2 right-2;
  border-left: 0;
  border-top: 0;
}

// 扫描线移动动画
@keyframes scanMove {
  0% {
    left: -120px; // 从屏幕左侧外开始
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.85;
  }
  100% {
    left: calc(100% + 120px); // 移动到屏幕右侧外
    opacity: 0;
  }
}

// 角落闪烁动画
@keyframes cornerFade {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

// 已扫描遮罩
.scanned-overlay {
  @apply absolute inset-0 bg-black/50 flex items-center justify-center;
  animation: fadeIn 0.3s ease-out;
}

.scanned-content {
  @apply flex flex-col items-center text-white gap-2;

  .check-icon {
    @apply text-4xl text-green-400;
    animation: scaleIn 0.3s ease-out;
  }
}

// 支付中遮罩
.paying-overlay {
  @apply absolute inset-0 bg-black/50 flex items-center justify-center;
}

.paying-content {
  @apply flex flex-col items-center text-white gap-2;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full;
  animation: spin 1s linear infinite;
}

// 状态文本
.status-text {
  @apply mt-4 text-sm text-gray-600 dark:text-gray-400;
}

// 动画关键帧
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
