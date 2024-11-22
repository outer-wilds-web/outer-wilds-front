<script setup lang="ts">
import SunLogo from '@/assets/images/soleil_transparent.png'
import SablieresLogo from '@/assets/images/sablieres_transparent.png'
import AtreboisLogo from '@/assets/images/atrebois_transparent.png'
import CraviteLogo from '@/assets/images/cravite_transparent.png'
import LeviatheLogo from '@/assets/images/leviathe_transparent.png'
import SombronceLogo from '@/assets/images/sombronce_transparent.png'
import ActivateSunLogo from '@/assets/images/soleil_orange.png'
import ActivateSablieresLogo from '@/assets/images/sablieres_orange.png'
import ActivateAtreboisLogo from '@/assets/images/atrebois_orange.png'
import ActivateCraviteLogo from '@/assets/images/cravite_orange.png'
import ActivateLeviatheLogo from '@/assets/images/leviathe_orange.png'
import ActivateSombronceLogo from '@/assets/images/sombronce_orange.png'

import ToggleButton from './ToggleButton.vue'

const props = defineProps({
  freeCamera: Boolean,
  focus: String
})

const emit = defineEmits(['changeFocus', 'toggleFreeCamera'])

const handleLogoClick = (logo: string) => {
  emit('changeFocus', logo)
}

const toggleFreeCamera = () => {
  emit('toggleFreeCamera')
}
</script>

<template>
  <div class="settings-panel">
    <h2>Settings</h2>
    <div class="settings">
      <div class="camera">
        <img
          :src="focus === 'sun' ? ActivateSunLogo : SunLogo"
          alt="Sun"
          @click="() => handleLogoClick('sun')"
        />
        <img
          :src="focus === 'sablieres' ? ActivateSablieresLogo : SablieresLogo"
          alt="Sablières"
          @click="() => handleLogoClick('sablieres')"
        />
        <img
          :src="focus === 'atrebois' ? ActivateAtreboisLogo : AtreboisLogo"
          alt="Atrebois"
          @click="() => handleLogoClick('atrebois')"
        />
        <img
          :src="focus === 'cravite' ? ActivateCraviteLogo : CraviteLogo"
          alt="Cravite"
          @click="() => handleLogoClick('cravite')"
        />
        <img
          :src="focus === 'leviathe' ? ActivateLeviatheLogo : LeviatheLogo"
          alt="Leviathe"
          @click="() => handleLogoClick('leviathe')"
        />
        <img
          :src="focus === 'sombronce' ? ActivateSombronceLogo : SombronceLogo"
          alt="Sombronce"
          @click="() => handleLogoClick('sombronce')"
        />
      </div>
      <div class="toggles">
        <ToggleButton class="toggle" :checked="freeCamera" @change="toggleFreeCamera"
          >Free Camera</ToggleButton
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-panel {
  display: flex;
  width: 300px;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 3px solid #fff;
  border-radius: 10px;

  h2 {
    font-weight: bold;
    margin-bottom: 15px;
  }

  h3 {
    font-weight: bold;
    margin-bottom: 1px;
    align-self: flex-start;
  }

  .camera {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-top: 10px;
      cursor: pointer;
    }
  }

  .toggles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;

    .toggle {
      margin-bottom: 10px;
      transform: scale(0.7);
    }
  }
}
</style>
