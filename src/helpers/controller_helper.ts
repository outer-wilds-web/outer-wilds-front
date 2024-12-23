import type { KeyPressed } from "../types/KeyPressed";
import { sendShipData } from "./websocket_helper";

export function handleKeyDown(event: KeyboardEvent, ws: WebSocket, keyPressed: KeyPressed) {
    let keyChanged = false
    switch (event.key) {
        case 's':
            keyPressed.engines.front = true
            keyChanged = true
            break
        case 'z':
            keyPressed.engines.back = true
            keyChanged = true
            break
        case 'd':
            keyPressed.engines.left = true
            keyChanged = true
            break
        case 'q':
            keyPressed.engines.right = true
            keyChanged = true
            break
        case 'e':
            keyPressed.engines.up = true
            keyChanged = true
            break
        case 'a':
            keyPressed.engines.down = true
            keyChanged = true
            break
        case 'ArrowRight':
            keyPressed.rotation.left = true
            keyChanged = true
            break
        case 'ArrowLeft':
            keyPressed.rotation.right = true
            keyChanged = true
            break
        case 'ArrowDown':
            keyPressed.rotation.up = true
            keyChanged = true
            break
        case 'ArrowUp':
            keyPressed.rotation.down = true
            keyChanged = true
            break
    }
    if (keyChanged) {
        sendShipData(ws, keyPressed)
    }
}

export function handleKeyUp(event: KeyboardEvent, ws: WebSocket, keyPressed: KeyPressed) {
    let keyChanged = false
    switch (event.key) {
        case 's':
            keyPressed.engines.front = false
            keyChanged = true
            break
        case 'z':
            keyPressed.engines.back = false
            keyChanged = true
            break
        case 'd':
            keyPressed.engines.left = false
            keyChanged = true
            break
        case 'q':
            keyPressed.engines.right = false
            keyChanged = true
            break
        case 'e':
            keyPressed.engines.up = false
            keyChanged = true
            break
        case 'a':
            keyPressed.engines.down = false
            keyChanged = true
            break
        case 'ArrowRight':
            keyPressed.rotation.left = false
            keyChanged = true
            break
        case 'ArrowLeft':
            keyPressed.rotation.right = false
            keyChanged = true
            break
        case 'ArrowDown':
            keyPressed.rotation.up = false
            keyChanged = true
            break
        case 'ArrowUp':
            keyPressed.rotation.down = false
            keyChanged = true
            break
    }

    if (keyChanged) {
        sendShipData(ws, keyPressed)
    }
}