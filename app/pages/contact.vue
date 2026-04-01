<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

useHead({
  title: '联系合作',
})

const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  contact: '',
  intent: '',
  budget: '',
  message: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请填写称呼', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写微信号或手机', trigger: 'blur' }],
  intent: [{ required: true, message: '请选择意向类型', trigger: 'change' }],
  message: [{ required: true, message: '请简单描述需求', trigger: 'blur' }],
}

const intentOptions = [
  { value: 'consult_once', label: '按次咨询（¥199）' },
  { value: 'coach_month', label: '按月陪跑（¥599）' },
  { value: 'product_custom', label: '产品化定制（询价）' },
  { value: 'other', label: '其他 / 先聊聊' },
]

const budgetOptions = [
  { value: 'lt_2k', label: '2000 以下' },
  { value: '2k_10k', label: '2000 - 1 万' },
  { value: '10k_50k', label: '1 万 - 5 万' },
  { value: 'gt_50k', label: '5 万以上' },
  { value: 'unsure', label: '暂不确定' },
]

const submitting = ref(false)

async function onSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const res = await $fetch<{ ok: boolean; message?: string }>('/api/contact', {
        method: 'POST',
        body: { ...form },
      })
      ElMessage.success(res.message || '提交成功')
      formRef.value?.resetFields()
    }
    catch {
      ElMessage.error('提交失败，请稍后重试或直接加微信沟通')
    }
    finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <div class="site-container py-12 sm:py-16 lg:py-20">
    <UPageHeader
      title="联系合作"
      description="填写下列表单便于初步匹配服务；也可直接通过微信与公众号建立连接（下方占位图可替换为实码）。" />

    <div class="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="contact-form max-w-lg"
          @submit.prevent="onSubmit">
          <el-form-item
            label="称呼"
            prop="name">
            <el-input
              v-model="form.name"
              placeholder="怎么称呼你"
              maxlength="32"
              show-word-limit />
          </el-form-item>
          <el-form-item
            label="微信号或手机"
            prop="contact">
            <el-input
              v-model="form.contact"
              placeholder="便于与你确认添加方式"
              maxlength="64" />
          </el-form-item>
          <el-form-item
            label="意向类型"
            prop="intent">
            <el-select
              v-model="form.intent"
              placeholder="请选择"
              class="w-full">
              <el-option
                v-for="o in intentOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="预算区间（选填）">
            <el-select
              v-model="form.budget"
              placeholder="帮助评估方案粒度"
              clearable
              class="w-full">
              <el-option
                v-for="o in budgetOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="需求说明"
            prop="message">
            <el-input
              v-model="form.message"
              type="textarea"
              :rows="5"
              placeholder="背景、目标、期望时间等"
              maxlength="2000"
              show-word-limit />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :loading="submitting"
              size="large"
              class="px-8!">
              提交意向
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="space-y-8">
        <SiteWechatBlock />
        <UAlert
          color="neutral"
          variant="subtle"
          title="说明"
          description="当前无经营主体展示；提交信息仅用于与你联系，不涉及主站公开展示。后续合作细节以双方沟通确认为准。" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-form :deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
