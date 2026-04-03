<script setup lang="ts">
import { SEO_DEFAULT_DESCRIPTION, SITE_NAME } from '~~/shared/constants/seo'

const config = useRuntimeConfig()
const route = useRoute()

const siteUrl = computed(() =>
  String(config.public.siteUrl || '')
    .trim()
    .replace(/\/$/, ''),
)

const canonicalHref = computed(() => {
  const base = siteUrl.value
  if (!base) return ''
  const p = route.path || '/'
  return `${base}${p === '/' ? '' : p}`
})

const jsonLd = computed(() =>
  siteUrl.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        description: SEO_DEFAULT_DESCRIPTION,
        url: siteUrl.value,
        inLanguage: 'zh-CN',
      }
    : null,
)

useHead(() => ({
  link: canonicalHref.value ? [{ rel: 'canonical', href: canonicalHref.value }] : [],
  script: jsonLd.value
    ? [
        {
          key: 'jk-website-jsonld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd.value),
        },
      ]
    : [],
}))
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
