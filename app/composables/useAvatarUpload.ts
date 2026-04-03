import { FetchError } from 'ofetch'
import type { UserAvatarData } from '~~/shared/types/api/auth'
import type { UnionResponse } from '~~/shared/types'
import { ResponseCode } from '~~/shared/types'

const MAX_BYTES = 5 * 1024 * 1024

/**
 * 个人中心头像上传：multipart POST /api/user/avatar，成功后写回 useAuthUser。
 */
export function useAvatarUpload() {
  const auth = useAuthUser()
  const toast = useToast()
  const config = useRuntimeConfig()
  const uploading = ref(false)

  async function uploadAvatar(file: File) {
    const token = auth.value?.token
    if (!token) {
      toast.add({ title: '请先登录', color: 'error', icon: 'i-lucide-circle-alert' })
      return
    }
    if (file.size > MAX_BYTES) {
      toast.add({ title: '图片大小不能超过 5MB', color: 'warning', icon: 'i-lucide-image-off' })
      return
    }

    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      const base = (config.public.apiBase as string) || ''
      const res = await $fetch<UnionResponse<UserAvatarData>>(`${base}/api/user/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.code !== ResponseCode.Success) {
        toast.add({ title: res.message, color: 'error', icon: 'i-lucide-circle-alert' })
        return
      }
      auth.value = {
        token,
        user: res.data.user,
      }
      toast.add({
        title: res.message || '头像已更新',
        color: 'success',
        icon: 'i-lucide-image-plus',
      })
    } catch (e) {
      if (e instanceof FetchError) {
        const raw = e.data as UnionResponse<unknown> | undefined
        toast.add({
          title: raw?.message ?? e.message ?? '上传失败',
          color: 'error',
          icon: 'i-lucide-circle-alert',
        })
      } else {
        toast.add({ title: '上传失败', color: 'error', icon: 'i-lucide-circle-alert' })
      }
    } finally {
      uploading.value = false
    }
  }

  return { uploading, uploadAvatar }
}
