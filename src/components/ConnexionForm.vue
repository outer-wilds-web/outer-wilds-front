<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSetupStore } from '@/stores/setup'

const authStore = useAuthStore()
const setupStore = useSetupStore()
const serverUrl = ref('')
const email = ref('')
const password = ref('')
const authApiUrl = ref('')
const websocketUrl = ref('')

const handleServerUrlSubmit = async () => {
  // Fetch the auth API URL from the game server
  const response = await fetch(`${serverUrl.value}/auth-api-url`)
  const data = await response.json()
  authApiUrl.value = data['auth_api_url']
  websocketUrl.value = data['websocket_url']
  setupStore.setBackendUrl(authApiUrl.value)
  setupStore.setWebsocketUrl(websocketUrl.value)
}

const handleLogin = async () => {
  const response = await fetch(`${authApiUrl.value}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email.value, password: password.value })
  })
  const data = await response.json()
  authStore.setToken(data.token)
}
</script>

<template>
  <div>
    <input v-model="serverUrl" placeholder="Enter game server URL" />
    <button @click="handleServerUrlSubmit">Submit</button>
  </div>
  <div v-if="authApiUrl">
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleLogin">Login</button>
  </div>
</template>

<style lang="scss" scoped></style>
