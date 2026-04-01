<script setup lang="ts"></script>

<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <JKAppHeader />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <JKAppFooter />
  </div>
</template>
