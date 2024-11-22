<script setup lang="ts"></script>

<template>
  <button class="options">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </button>
</template>

<style lang="scss" scoped>
.options {
  border: 3px solid #fff;
  border-radius: 5px;
  width: 50px;
  height: 50px;
  background: none;

  &:hover {
    background: #fff;
    cursor: pointer;

    .line {
      background: #000;
    }
  }

  .line {
    width: 30px;
    height: 3px;
    background: #fff;
    margin: 5px auto;
  }
}
</style>
