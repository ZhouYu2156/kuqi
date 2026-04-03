<script setup lang="ts">
import confetti from 'canvas-confetti'

const isOpen = defineModel<boolean>('open', { default: false })

function playCelebration() {
  if (!import.meta.client) return
  const duration = 3500
  const end = Date.now() + duration
  const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#f97316']

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

watch(isOpen, (v) => {
  if (v) nextTick(() => playCelebration())
})

function close() {
  isOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-200 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebrate-vip-title"
        @click.self="close"
        @keydown.escape="close">
        <div
          class="border-default bg-elevated relative w-full max-w-md rounded-2xl border p-8 shadow-2xl"
          @click.stop>
          <div class="flex flex-col items-center gap-4 text-center">
            <div
              class="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-600 shadow-lg ring-2 ring-amber-400/30">
              <UIcon
                name="i-lucide-crown"
                class="size-9 text-white drop-shadow" />
            </div>
            <h2
              id="celebrate-vip-title"
              class="text-2xl font-bold -tracking-tight">
              <span class="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                恭喜成为至尊会员
              </span>
            </h2>
            <p class="text-muted text-sm leading-relaxed tracking-wider">极客兔全站高品质音乐已为您解锁</p>
            <UButton
              color="primary"
              size="lg"
              block
              class="mt-2 font-semibold"
              @click="close">
              开始畅听
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss"></style>
