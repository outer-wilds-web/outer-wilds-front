<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="page">
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page {
  flex: 1;
}
</style>
