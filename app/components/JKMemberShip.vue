<script setup lang="ts">
import { ref } from 'vue'

// 选中的会员套餐
const selectedPlan = ref<'monthly' | 'yearly'>('yearly')

interface MembershipPlan {
  id: 'monthly' | 'yearly' // 套餐ID
  name: string // 套餐名称
  price: number // 套餐价格
  originalPrice: number // 原价
  period: '月' | '年' // 套餐周期
  features: string[] // 套餐特权
  effective?: boolean // 是否有效
  popular?: boolean // 最受欢迎套餐
}

// 会员套餐计划
const membershipPlans: MembershipPlan[] = [
  {
    id: 'monthly',
    name: '月度会员',
    price: 19.9,
    originalPrice: 49,
    period: '月',
    features: ['所有付费课程无限观看', '配套资料领取', '专属会员社群'],
    // 适合短期提升
    effective: true,
  },
  {
    id: 'yearly',
    name: '年度会员',
    price: 99.9,
    originalPrice: 259,
    period: '年',
    features: ['所有付费课程无限观看', '配套资料领取', '专属会员社群', '技术问答服务', '年度大会员专属礼包'],
    popular: true,
  },
]
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss"></style>
