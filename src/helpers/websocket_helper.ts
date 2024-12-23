import type { KeyPressed } from '../types/KeyPressed'

export function sendShipData(ws: WebSocket, keyPressed: KeyPressed) {
    if (ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: 'ship',
                data: {
                    engines: keyPressed.engines,
                    rotation: keyPressed.rotation
                }
            })
        )
    }
}