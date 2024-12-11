<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SceneInit from '@/threejs/SceneInit'
import * as THREE from 'three'
import Planet from '@/threejs/Planet'
import OptionButton from '@/components/OptionButton.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

const test = new SceneInit()

const shipLoader = new GLTFLoader()
let theship: THREE.Group
shipLoader.load(
  '3DModels/theship.glb',
  (gltf) => {
    theship = gltf.scene
    theship.scale.set(1, 1, 1)
    test.scene.add(theship)
    theship.position.set(0, 0, 50)
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error)
  }
)

const sunTexture = new THREE.TextureLoader().load('sun.jpeg')
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
const solarSystem = new THREE.Group()

const sablieres = new Planet(2, 16, 16, 'mercury.png')
const sablieresMesh = sablieres.getMesh()
const sablieresSystem = new THREE.Group()

const atrebois = new Planet(3, 32, 32, 'venus.jpeg')
const atreboisMesh = atrebois.getMesh()
const atreboisSystem = new THREE.Group()

const cravite = new Planet(4, 64, 64, 'earth.jpeg')
const craviteMesh = cravite.getMesh()
const craviteSystem = new THREE.Group()

const leviathe = new Planet(7, 128, 128, 'mars.jpeg')
const leviatheMesh = leviathe.getMesh()
const leviatheSystem = new THREE.Group()

const sombronce = new Planet(6, 256, 256, 'sun.jpeg')
const sombronceMesh = sombronce.getMesh()
const sombronceSystem = new THREE.Group()

const trajectories = {
  sablieres: new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ),
  atrebois: new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ),
  cravite: new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ),
  leviathe: new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  ),
  sombronce: new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([], 3)),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  )
}

function addPointToTrajectory(planetMesh: THREE.Mesh, trajectory: THREE.Line) {
  const positions = trajectory.geometry.attributes.position.array
  const newPositions = new Float32Array(positions.length + 3)
  newPositions.set(positions)
  newPositions.set(
    [planetMesh.position.x, planetMesh.position.y, planetMesh.position.z],
    positions.length
  )
  trajectory.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
  trajectory.geometry.attributes.position.needsUpdate = true
  trajectory.geometry.setDrawRange(0, newPositions.length / 3)
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
  sunMesh.add(sunLight)

  const ambiantLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
  test.scene.add(ambiantLight)

  //#endregion : --- Lights

  test.scene.add(solarSystem)
  sablieresSystem.add(sablieresMesh)
  atreboisSystem.add(atreboisMesh)
  craviteSystem.add(craviteMesh)
  leviatheSystem.add(leviatheMesh)
  sombronceSystem.add(sombronceMesh)
  solarSystem.add(
    sunMesh,
    sablieresSystem,
    atreboisSystem,
    craviteSystem,
    leviatheSystem,
    sombronceSystem
  )
  solarSystem.add(
    trajectories.sablieres,
    trajectories.atrebois,
    trajectories.cravite,
    trajectories.leviathe,
    trajectories.sombronce
  )

  setInterval(() => {
    addPointToTrajectory(sablieresMesh, trajectories.sablieres)
    addPointToTrajectory(atreboisMesh, trajectories.atrebois)
    addPointToTrajectory(craviteMesh, trajectories.cravite)
    addPointToTrajectory(leviatheMesh, trajectories.leviathe)
    addPointToTrajectory(sombronceMesh, trajectories.sombronce)
  }, 1000 / 60)

  // Connect to WebSocker
  const ws = new WebSocket('ws://localhost:3012')

  // Animate solar system
  const animate = () => {
    sunMesh.rotation.y += 0.01
    sablieresMesh.rotation.y += 0.05
    atreboisMesh.rotation.y += 0.04
    craviteMesh.rotation.y += 0.02
    leviatheMesh.rotation.y += 0.01
    sombronceMesh.rotation.y += 0.005

    requestAnimationFrame(animate)
    test.renderer.render(test.scene, test.camera)
  }
  animate()

  ws.onopen = () => {
    console.log('Connected to the server')
  }

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    sablieresMesh.position.set(data[0][1][0], data[0][1][1], 0)
    atreboisMesh.position.set(data[1][1][0], data[1][1][1], 0)
    craviteMesh.position.set(data[2][1][0], data[2][1][1], 0)
    leviatheMesh.position.set(data[3][1][0], data[3][1][1], 0)
    sombronceMesh.position.set(data[4][1][0], data[4][1][1], 0)

    // update the camera focus to follow a planet
    if (!freeCamera.value) {
      handleChangeFocus(cameraFocus.value)
    }
  }

  ws.onclose = () => {
    console.log('Disconnected from the server')
  }

  ws.onerror = (error) => {
    console.log(error)
  }
})

const settingPanelVisible = ref(false)
function toggleSettingPanel() {
  settingPanelVisible.value = !settingPanelVisible.value
}

function updateCamera(x: number, y: number, z: number = 0) {
  // test.camera.position.set(x, y, z + fov)
  test.camera.lookAt(x, y, z)
  test.controls.target.set(x, y, z)
}

function handleChangeFocus(logo: string) {
  if (logo === 'sun') {
    updateCamera(0, 0, 0)
    cameraFocus.value = 'sun'
  } else if (logo === 'sablieres') {
    updateCamera(sablieresMesh.position.x, sablieresMesh.position.y, 0)
    cameraFocus.value = 'sablieres'
  } else if (logo === 'atrebois') {
    updateCamera(atreboisMesh.position.x, atreboisMesh.position.y, 0)
    cameraFocus.value = 'atrebois'
  } else if (logo === 'cravite') {
    updateCamera(craviteMesh.position.x, craviteMesh.position.y, 0)
    cameraFocus.value = 'cravite'
  } else if (logo === 'leviathe') {
    updateCamera(leviatheMesh.position.x, leviatheMesh.position.y, 0)
    cameraFocus.value = 'leviathe'
  } else if (logo === 'sombronce') {
    updateCamera(sombronceMesh.position.x, sombronceMesh.position.y, 0)
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
