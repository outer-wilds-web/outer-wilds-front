<script setup lang="ts">
defineProps<{
  loading: boolean
  progress: number
}>()
</script>

<template>
  <div id="loading-overlay" v-if="loading">
    <div class="title">Outer Wilds</div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${progress * 100}%` }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.title {
  color: orange;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
}

.progress-bar {
  width: 80%;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: orange;
  transition: width 0.3s;
}
</style>
