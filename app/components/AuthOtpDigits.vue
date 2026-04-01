<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const r0 = ref<HTMLInputElement | null>(null)
const r1 = ref<HTMLInputElement | null>(null)
const r2 = ref<HTMLInputElement | null>(null)
const r3 = ref<HTMLInputElement | null>(null)

const boxes = [r0, r1, r2, r3]

function focusAt(i: number) {
  nextTick(() => boxes[i]?.value?.focus())
}

const digits = computed(() => {
  const s = props.modelValue.replace(/\D/g, '').slice(0, 4)
  return [s[0] ?? '', s[1] ?? '', s[2] ?? '', s[3] ?? '']
})

function onInput(index: number, e: Event) {
  const d = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  const cur = props.modelValue.replace(/\D/g, '').slice(0, 4)
  const arr = ['', '', '', ''] as string[]
  for (let i = 0; i < cur.length; i++) arr[i] = cur[i] ?? ''
  arr[index] = d
  emit('update:modelValue', arr.join(''))
  if (d && index < 3) focusAt(index + 1)
}

function onKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    const cur = digits.value[index]
    if (!cur && index > 0) {
      e.preventDefault()
      focusAt(index - 1)
    }
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const s = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 4)
  emit('update:modelValue', s)
  focusAt(Math.min(Math.max(s.length - 1, 0), 3))
}
</script>

<template>
  <div
    class="flex w-full justify-start gap-2 sm:gap-3"
    role="group"
    aria-label="邮箱验证码">
    <input
      ref="r0"
      :value="digits[0]"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :disabled="disabled"
      class="h-12 w-11 rounded-lg border-2 border-zinc-200 bg-white text-center text-xl font-semibold tabular-nums text-zinc-900 outline-none transition-colors focus:border-(--jk-primary) focus:ring-2 focus:ring-(--jk-ring) disabled:opacity-50 dark:border-white/15 dark:bg-(--jk-input-surface-dark) dark:text-white sm:h-14 sm:w-12 sm:text-2xl"
      type="text"
      @input="onInput(0, $event)"
      @keydown="onKeydown(0, $event)"
      @paste="onPaste"
    >
    <input
      ref="r1"
      :value="digits[1]"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :disabled="disabled"
      class="h-12 w-11 rounded-lg border-2 border-zinc-200 bg-white text-center text-xl font-semibold tabular-nums text-zinc-900 outline-none transition-colors focus:border-(--jk-primary) focus:ring-2 focus:ring-(--jk-ring) disabled:opacity-50 dark:border-white/15 dark:bg-(--jk-input-surface-dark) dark:text-white sm:h-14 sm:w-12 sm:text-2xl"
      type="text"
      @input="onInput(1, $event)"
      @keydown="onKeydown(1, $event)"
    >
    <input
      ref="r2"
      :value="digits[2]"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :disabled="disabled"
      class="h-12 w-11 rounded-lg border-2 border-zinc-200 bg-white text-center text-xl font-semibold tabular-nums text-zinc-900 outline-none transition-colors focus:border-(--jk-primary) focus:ring-2 focus:ring-(--jk-ring) disabled:opacity-50 dark:border-white/15 dark:bg-(--jk-input-surface-dark) dark:text-white sm:h-14 sm:w-12 sm:text-2xl"
      type="text"
      @input="onInput(2, $event)"
      @keydown="onKeydown(2, $event)"
    >
    <input
      ref="r3"
      :value="digits[3]"
      inputmode="numeric"
      maxlength="1"
      autocomplete="one-time-code"
      :disabled="disabled"
      class="h-12 w-11 rounded-lg border-2 border-zinc-200 bg-white text-center text-xl font-semibold tabular-nums text-zinc-900 outline-none transition-colors focus:border-(--jk-primary) focus:ring-2 focus:ring-(--jk-ring) disabled:opacity-50 dark:border-white/15 dark:bg-(--jk-input-surface-dark) dark:text-white sm:h-14 sm:w-12 sm:text-2xl"
      type="text"
      @input="onInput(3, $event)"
      @keydown="onKeydown(3, $event)"
    >
  </div>
</template>
