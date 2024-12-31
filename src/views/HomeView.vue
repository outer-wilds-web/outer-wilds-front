<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SceneInit from '@/threejs/SceneInit'
import * as THREE from 'three'
import Planet from '@/threejs/Planet'
import OptionButton from '@/components/OptionButton.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

import { addPointToTrajectory, fetchShipHistory, loadModel } from '@/helpers/threejs_helper'
import { handleKeyDown, handleKeyUp } from '@/helpers/controller_helper'
import { sendShipData } from '@/helpers/websocket_helper'

const loading = ref(true)
const loadingProgress = ref(0)

const totalModels = 8
let loadedModels = 0

function onLoad() {
  loadedModels++
  loadingProgress.value = loadedModels / totalModels
  if (loadedModels === totalModels) {
    loading.value = false
  }
}

const test = new SceneInit()

let theship = new THREE.Group()
loadModel(
  theship,
  test,
  '3DModels/theship.glb',
  '3DModels/spaceship.glb',
  [1, 1, 1],
  [0, 0, 0],
  onLoad
)

const solarSystem = new THREE.Group()

const sun = new THREE.Group()
loadModel(
  sun,
  test,
  '3DModels/sun.glb',
  '3DModels/solar_system/sun.glb',
  [1, 1, 1],
  [0, 0, 0],
  onLoad
)

const sablieres = new Planet(
  0.01,
  16,
  0,
  '3DModels/sand_earth.glb',
  '3DModels/solar_system/mercury.glb',
  test,
  onLoad
)

const atrebois = new Planet(
  0.01,
  32,
  0,
  '3DModels/timber_earth.glb',
  '3DModels/solar_system/venus.glb',
  test,
  onLoad
)

const cravite = new Planet(
  0.01,
  64,
  0,
  '3DModels/cravite_earth.glb',
  '3DModels/solar_system/earth.glb',
  test,
  onLoad
)

const leviathe = new Planet(
  0.01,
  128,
  0,
  '3DModels/leviathe_earth.glb',
  '3DModels/solar_system/mars.glb',
  test,
  onLoad
)

const sombronce = new Planet(
  0.01,
  256,
  0,
  '3DModels/sombronce_earth.glb',
  '3DModels/solar_system/jupiter.glb',
  test,
  onLoad
)

const trajectories = {
  sablieres: new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
  ),
  atrebois: new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
  ),
  cravite: new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
  ),
  leviathe: new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
  ),
  sombronce: new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
  )
}

let keyPressed = {
  engines: {
    front: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false
  },
  rotation: {
    left: false,
    right: false,
    up: false,
    down: false
  }
}

onMounted(() => {
  test.init()
  test.animate()

  //#region :    --- Space background

  var stars = new Array(0)
  const exclusionRadius = 10000 // Rayon de la sphère sans étoiles
  for (var i = 0; i < 300000; i++) {
    let x = THREE.MathUtils.randFloatSpread(70000)
    let y = THREE.MathUtils.randFloatSpread(70000)
    let z = THREE.MathUtils.randFloatSpread(70000)
    if (Math.sqrt(x * x + y * y + z * z) > exclusionRadius) {
      stars.push(x, y, z)
    }
  }
  var starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3))
  var starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 50 })
  var starField = new THREE.Points(starsGeometry, starsMaterial)
  test.scene.add(starField)

  //#endregion : --- Space background

  //#region :    --- Lights

  const sunLight = new THREE.PointLight(0xffffff, 10000, 1000)
  sun.add(sunLight)

  const ambiantLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
  test.scene.add(ambiantLight)

  //#endregion : --- Lights

  test.scene.add(solarSystem)
  solarSystem.add(
    sun,
    sablieres.group,
    atrebois.group,
    cravite.group,
    leviathe.group,
    sombronce.group
  )
  solarSystem.add(
    trajectories.sablieres,
    trajectories.atrebois,
    trajectories.cravite,
    trajectories.leviathe,
    trajectories.sombronce
  )

  const ships: any = {}

  setInterval(() => {
    addPointToTrajectory(sablieres.group, trajectories.sablieres, !loading.value)
    addPointToTrajectory(atrebois.group, trajectories.atrebois, !loading.value)
    addPointToTrajectory(cravite.group, trajectories.cravite, !loading.value)
    addPointToTrajectory(leviathe.group, trajectories.leviathe, !loading.value)
    addPointToTrajectory(sombronce.group, trajectories.sombronce, !loading.value)
    Object.keys(ships).forEach((shipId: any) => {
      addPointToTrajectory(ships[shipId].group, ships[shipId].trajectory, !loading.value)
    })
  }, 500)

  // Connect to WebSocker
  const ws = new WebSocket('ws://localhost:3012')

  // Animate solar system
  const animate = () => {
    sun.rotation.y += 0.01
    sablieres.group.rotation.y += 0.05
    atrebois.group.rotation.y += 0.04
    cravite.group.rotation.y += 0.02
    leviathe.group.rotation.y += 0.01
    sombronce.group.rotation.y += 0.005

    requestAnimationFrame(animate)
    test.renderer.render(test.scene, test.camera)
  }
  animate()

  //#region :    --- Websocket events

  ws.onopen = () => {
    console.log('Connected to the server')
    onLoad()
  }

  // Receive data from the server
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)

    sablieres.group.position.set(data['planets'][0][1][0], data['planets'][0][1][1], 0)
    atrebois.group.position.set(data['planets'][1][1][0], data['planets'][1][1][1], 0)
    cravite.group.position.set(data['planets'][2][1][0], data['planets'][2][1][1], 0)
    leviathe.group.position.set(data['planets'][3][1][0], data['planets'][3][1][1], 0)
    sombronce.group.position.set(data['planets'][4][1][0], data['planets'][4][1][1], 0)
    theship.position.set(
      data['ship']['position'][0],
      data['ship']['position'][1],
      data['ship']['position'][2]
    )
    theship.lookAt(
      data['ship']['direction'][0] * 1000000,
      data['ship']['direction'][1] * 1000000,
      data['ship']['direction'][2] * 1000000
    )

    data['ships'].forEach((shipData: any) => {
      const shipId = shipData['uuid']
      if (!ships[shipId]) {
        ships[shipId] = {
          group: new THREE.Group(),
          trajectory: new THREE.Points(
            new THREE.BufferGeometry().setAttribute(
              'position',
              new THREE.Float32BufferAttribute([], 3)
            ),
            new THREE.PointsMaterial({ color: 0x57f94d, size: 2 })
          )
        }
        loadModel(
          ships[shipId].group,
          test,
          '3DModels/theship.glb',
          '3DModels/spaceship.glb',
          [1, 1, 1],
          [0, 0, 0],
          onLoad
        )

        solarSystem.add(ships[shipId].group)
        fetchShipHistory(shipId, ships)
      }

      ships[shipId].group.position.set(
        shipData['position'][0],
        shipData['position'][1],
        shipData['position'][2]
      )
      ships[shipId].group.lookAt(
        shipData['direction'][0] * 1000000,
        shipData['direction'][1] * 1000000,
        shipData['direction'][2] * 1000000
      )
    })

    // remove ship which are not send data
    Object.keys(ships).forEach((shipId: any) => {
      if (!data['ships'].some((shipData: any) => shipData['uuid'] === shipId)) {
        test.scene.remove(ships[shipId].group)
        delete ships[shipId]
      }
    })

    // update the camera focus to follow a planet
    if (!freeCamera.value) {
      handleChangeFocus(cameraFocus.value)
    }

    // update the camera position to follow the ship
    if (!freeCamera.value && cameraFocus.value === 'theship') {
      test.camera.position.set(
        data['ship']['position'][0] + data['ship']['direction'][0] * 10,
        data['ship']['position'][1] + data['ship']['direction'][1] * 10,
        data['ship']['position'][2] + data['ship']['direction'][2] * 10
      )
      test.camera.lookAt(
        data['ship']['direction'][0] * 1000000,
        data['ship']['direction'][1] * 1000000,
        data['ship']['direction'][2] * 1000000
      )
      test.controls.target.set(
        data['ship']['direction'][0] * 1000000,
        data['ship']['direction'][1] * 1000000,
        data['ship']['direction'][2] * 1000000
      )
    }
  }

  ws.onclose = () => {
    console.log('Disconnected from the server')
  }

  ws.onerror = (error) => {
    console.log(error)
  }
  //#endregion : --- Websocket events

  //#region :    --- Keyboard events to move the ship

  window.addEventListener('keydown', (event: KeyboardEvent) => handleKeyDown(event, ws, keyPressed))
  window.addEventListener('keyup', (event: KeyboardEvent) => handleKeyUp(event, ws, keyPressed))
  sendShipData(ws, keyPressed)

  //#endregion : --- Keyboard events to move the ship
})

const settingPanelVisible = ref(false)

function toggleSettingPanel() {
  settingPanelVisible.value = !settingPanelVisible.value
}

function updateCamera(x: number, y: number, z: number = 0) {
  test.camera.lookAt(x, y, z)
  test.controls.target.set(x, y, z)
}

function handleChangeFocus(logo: string) {
  if (logo === 'sun') {
    updateCamera(0, 0, 0)
    cameraFocus.value = 'sun'
  } else if (logo === 'sablieres') {
    updateCamera(sablieres.group.position.x, sablieres.group.position.y, 0)
    cameraFocus.value = 'sablieres'
  } else if (logo === 'atrebois') {
    updateCamera(atrebois.group.position.x, atrebois.group.position.y, 0)
    cameraFocus.value = 'atrebois'
  } else if (logo === 'cravite') {
    updateCamera(cravite.group.position.x, cravite.group.position.y, 0)
    cameraFocus.value = 'cravite'
  } else if (logo === 'leviathe') {
    updateCamera(leviathe.group.position.x, leviathe.group.position.y, 0)
    cameraFocus.value = 'leviathe'
  } else if (logo === 'sombronce') {
    updateCamera(sombronce.group.position.x, sombronce.group.position.y, 0)
    cameraFocus.value = 'sombronce'
  } else if (logo == 'theship') {
    updateCamera(theship.position.x, theship.position.y + 3, theship.position.z)
    cameraFocus.value = 'theship'
  }
}

const freeCamera = ref(false)
const cameraFocus = ref('sun')
function toggleFreeCamera() {
  freeCamera.value = !freeCamera.value
}
</script>

<template>
  <LoadingOverlay :progress="loadingProgress" :loading="loading" />
  <canvas id="canvas" />
  <OptionButton class="options" @click="toggleSettingPanel" />
  <SettingsPanel
    v-if="settingPanelVisible"
    class="settings-panel"
    :free-camera="freeCamera"
    :focus="cameraFocus"
    @change-focus="handleChangeFocus"
    @toggle-free-camera="toggleFreeCamera"
  />
</template>

<style lang="scss" scoped>
#canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.options {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
}

.settings-panel {
  position: absolute;
  top: 90px;
  right: 20px;
  z-index: 1;
}
</style>
