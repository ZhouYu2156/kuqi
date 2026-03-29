<script setup lang="ts"></script>

<template>
  <div class="w-full min-h-screen flex justify-center bg-old-bg">
    <div class="w-240 flex flex-col min-h-screen bg-white border border-old-border">
      <Tags />
      <Nav />
      <main class="main">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.main {
  @apply flex-1 p-2;
}
</style>
