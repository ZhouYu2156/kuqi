<script setup lang="ts">
import type { OrderStatus } from '~~/shared/types/db/order'

defineProps<{
  qrCode: string
  status: OrderStatus
}>()
</script>

<template>
  <!-- w-fit + shrink-0：避免在 UModal 的 flex 列中被纵向拉伸，导致子级 absolute 相对整块弹窗 -->
  <div class="qr-code-root">
    <div class="qr-code-card">
      <!-- 固定像素框 + overflow-hidden：激光与四角只作用于本矩形，与 img 同尺寸 -->
      <div class="qr-code-frame">
        <img
          :src="qrCode"
          alt="支付二维码"
          class="qr-code-image"
          width="200"
          height="200"
          decoding="async" />

        <template v-if="status === OrderStatus.NOTPAY">
          <div
            class="qr-scan-layer"
            aria-hidden="true">
            <div class="laser-beam" />
          </div>
          <div
            class="qr-corner qr-corner--tl"
            aria-hidden="true" />
          <div
            class="qr-corner qr-corner--tr"
            aria-hidden="true" />
          <div
            class="qr-corner qr-corner--bl"
            aria-hidden="true" />
          <div
            class="qr-corner qr-corner--br"
            aria-hidden="true" />
        </template>

        <div
          v-else-if="status === OrderStatus.SUCCESS"
          class="state-overlay state-overlay--success">
          <div class="scanned-content">
            <UIcon
              name="i-lucide-check"
              class="check-icon size-10" />
            <span>已扫码</span>
          </div>
        </div>

        <div
          v-else-if="status === OrderStatus.USERPAYING"
          class="state-overlay state-overlay--paying">
          <div class="paying-content">
            <div class="loading-spinner" />
            <span>正在支付...</span>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="status !== OrderStatus.NOTPAY"
      class="status-text">
      {{
        status === OrderStatus.SUCCESS
          ? '请在手机上确认支付'
          : status === OrderStatus.USERPAYING
            ? '正在处理支付...'
            : '支付失败'
      }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.qr-code-root {
  @apply inline-flex w-fit max-w-full shrink-0 flex-col items-center;
}

.qr-code-card {
  @apply rounded-xl bg-white p-3 shadow-md ring-1 ring-black/5 dark:bg-white dark:ring-white/10;
}

/*
  必须用固定宽高，避免在 flex 父级里高度被撑满整屏，否则 absolute 子元素会相对「被拉高的框」
  甚至误相对更外层定位，出现激光/四角贴到弹窗边的问题。
*/
.qr-code-frame {
  position: relative;
  z-index: 0;
  width: 200px;
  height: 200px;
  max-width: min(200px, 85vw);
  max-height: min(200px, 85vw);
  overflow: hidden;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.qr-code-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 与 frame 完全重合（随 frame 缩放） */
.qr-scan-layer {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  box-sizing: border-box;
}

/* 四角：直接相对 .qr-code-frame 定位（不再套一层，避免包含块歧义） */
.qr-corner {
  position: absolute;
  z-index: 2;
  width: 1.125rem;
  height: 1.125rem;
  border-style: solid;
  border-color: rgb(59, 130, 246);
  opacity: 0.92;
  pointer-events: none;
  box-sizing: border-box;
}

.qr-corner--tl {
  top: 3px;
  left: 3px;
  border-width: 3px 0 0 3px;
  border-radius: 4px 0 0 0;
}

.qr-corner--tr {
  top: 3px;
  right: 3px;
  border-width: 3px 3px 0 0;
  border-radius: 0 4px 0 0;
}

.qr-corner--bl {
  bottom: 3px;
  left: 3px;
  border-width: 0 0 3px 3px;
  border-radius: 0 0 0 4px;
}

.qr-corner--br {
  right: 3px;
  bottom: 3px;
  border-width: 0 3px 3px 0;
  border-radius: 0 0 4px 0;
}

/* 竖条光带在 .qr-scan-layer 内从左扫到右；阴影减弱，避免溢出观感像全屏 */
.laser-beam {
  position: absolute;
  top: 0;
  left: -38%;
  height: 100%;
  width: 38%;
  min-width: 2.25rem;
  max-width: 5rem;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0) 0%,
    rgba(59, 130, 246, 0.08) 18%,
    rgba(96, 165, 250, 0.55) 42%,
    rgba(147, 197, 253, 0.95) 50%,
    rgba(96, 165, 250, 0.55) 58%,
    rgba(59, 130, 246, 0.08) 82%,
    rgba(59, 130, 246, 0) 100%
  );
  animation: laserSweepLr 2.3s ease-in-out infinite;
}

@keyframes laserSweepLr {
  0% {
    left: -38%;
    opacity: 0.65;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0.65;
  }
}

.state-overlay {
  position: absolute;
  z-index: 3;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.state-overlay--success {
  @apply bg-black/50;
  animation: fadeIn 0.3s ease-out;
}

.state-overlay--paying {
  @apply bg-black/50;
}

.scanned-content {
  @apply flex flex-col items-center gap-2 text-white;

  .check-icon {
    @apply text-4xl text-green-400;
    animation: scaleIn 0.3s ease-out;
  }
}

.paying-content {
  @apply flex flex-col items-center gap-2 text-white;
}

.loading-spinner {
  @apply h-8 w-8 rounded-full border-4 border-blue-400 border-t-transparent;
  animation: spin 1s linear infinite;
}

.status-text {
  @apply mt-4 text-sm text-gray-600 dark:text-gray-400;
}

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

@media (prefers-reduced-motion: reduce) {
  .laser-beam {
    animation: none;
    left: 31%;
    opacity: 0.75;
  }
}
</style>
