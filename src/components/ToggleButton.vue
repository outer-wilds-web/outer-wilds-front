<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  checked: Boolean
})

const emit = defineEmits(['change'])

const handleChange = () => {
  emit('change')
}
</script>

<template>
  <div class="button">
    <label class="switch">
      <input type="checkbox" :checked="checked" @change="handleChange" />
      <span class="slider round"></span>
    </label>
    <span class="label"><slot></slot></span>
  </div>
</template>

<style lang="scss" scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #ff7300;
}

input:focus + .slider {
  box-shadow: 0 0 1px #ff7300;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.button {
  display: flex;
  align-items: center;
}

.label {
  margin-left: 10px;
  font-size: 20px;
}
</style>
