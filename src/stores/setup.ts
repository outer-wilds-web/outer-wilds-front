import { defineStore } from 'pinia'

export const useSetupStore = defineStore('setup', {
    state: () => ({
        backend_url: '',
        websocket_url: '',
    }),
    actions: {
        setBackendUrl(backend_url: string) {
            this.backend_url = backend_url
        },
        setWebsocketUrl(websocket_url: string) {
            this.websocket_url = websocket_url
        }
    }
})