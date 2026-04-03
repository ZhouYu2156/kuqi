<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: '个人中心',
})

const route = useRoute()
const auth = useAuthUser()
const user = computed(() => auth.value?.user)

const isProfile = computed(() => {
  const p = route.path
  return p === '/dashboard' || p === '/dashboard/'
})

const isOrders = computed(() => route.path.startsWith('/dashboard/orders'))

const fileInputRef = ref<HTMLInputElement | null>(null)
const { uploading, uploadAvatar } = useAvatarUpload()

function onAvatarFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  void uploadAvatar(file)
}
</script>

<template>
  <UContainer class="max-w-6xl py-6 md:py-10">
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl font-semibold tracking-tight text-highlighted md:text-3xl text-center">个人中心</h1>
    </div>

    <div
      v-if="user"
      class="flex flex-col gap-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside class="space-y-6 lg:sticky lg:top-24">
        <div class="border-default bg-elevated/30 flex flex-col items-center rounded-xl border p-6 text-center">
          <input
            ref="fileInputRef"
            type="file"
            class="sr-only"
            accept="image/png,image/jpeg,image/gif,.png,.jpg,.jpeg,.gif"
            :disabled="uploading"
            @change="onAvatarFileChange" />
          <button
            type="button"
            class="group relative shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
            :disabled="uploading"
            aria-label="上传或更换头像"
            @click="fileInputRef?.click()">
            <UAvatar
              size="3xl"
              :src="user.avatar"
              :alt="user.username"
              :text="user.username?.slice(0, 2) ?? '?'" />
            <span
              class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <UIcon
                :name="uploading ? 'i-lucide-loader-2' : 'i-lucide-camera'"
                class="size-9 text-white"
                :class="{ 'animate-spin': uploading }" />
            </span>
          </button>
          <p class="text-highlighted mt-4 max-w-full truncate text-base font-semibold">
            {{ user.username }}
          </p>
        </div>

        <nav
          class="flex flex-col gap-1"
          aria-label="个人中心菜单">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            :class="
              isProfile ? 'bg-primary/12 text-primary font-medium' : 'text-muted hover:bg-elevated hover:text-default'
            ">
            <UIcon
              name="i-lucide-user-circle"
              class="size-5 shrink-0" />
            基础信息
          </NuxtLink>
          <NuxtLink
            to="/dashboard/orders"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            :class="
              isOrders ? 'bg-primary/12 text-primary font-medium' : 'text-muted hover:bg-elevated hover:text-default'
            ">
            <UIcon
              name="i-lucide-scroll-text"
              class="size-5 shrink-0" />
            历史订单
          </NuxtLink>
        </nav>
      </aside>

      <main class="min-w-0">
        <NuxtPage />
      </main>
    </div>
  </UContainer>
</template>
