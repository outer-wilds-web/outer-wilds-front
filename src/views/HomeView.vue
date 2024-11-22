<script setup lang="ts">
import { onMounted } from 'vue'
import SceneInit from '@/threejs/SceneInit'
import * as THREE from 'three'
import Planet from '@/threejs/Planet'

onMounted(() => {
  let test = new SceneInit()
  test.init()
  test.animate()

  //#region :    --- Space background

  var stars = new Array(0)
  const exclusionRadius = 10000 // Rayon de la sphère sans étoiles
  for (var i = 0; i < 1000000; i++) {
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

  const sunTexture = new THREE.TextureLoader().load('sun.jpeg')
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32)
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
  const solarSystem = new THREE.Group()
  solarSystem.add(sunMesh)
  test.scene.add(solarSystem)

  const mercury = new Planet(2, 16, 16, 'mercury.png')
  const mercuryMesh = mercury.getMesh()
  const mercurySystem = new THREE.Group()
  mercurySystem.add(mercuryMesh)

  const venus = new Planet(3, 32, 32, 'venus.jpeg')
  const venusMesh = venus.getMesh()
  const venusSystem = new THREE.Group()
  venusSystem.add(venusMesh)

  const earth = new Planet(4, 64, 64, 'earth.jpeg')
  const earthMesh = earth.getMesh()
  const earthSystem = new THREE.Group()
  earthSystem.add(earthMesh)

  const mars = new Planet(5, 128, 128, 'mars.jpeg')
  const marsMesh = mars.getMesh()
  const marsSystem = new THREE.Group()
  marsSystem.add(marsMesh)

  solarSystem.add(mercurySystem, venusSystem, earthSystem, marsSystem)

  // Connect to WebSocker
  const ws = new WebSocket('ws://localhost:3012')

  // Animate solar system
  const animate = () => {
    sunMesh.rotation.y += 0.01
    requestAnimationFrame(animate)
  }
  animate()

  ws.onopen = () => {
    console.log('Connected to the server')
  }

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    mercuryMesh.position.set(data[0][1][0], data[0][1][1], 0)
    venusMesh.position.set(data[1][1][0], data[1][1][1], 0)
    earthMesh.position.set(data[2][1][0], data[2][1][1], 0)
    marsMesh.position.set(data[3][1][0], data[3][1][1], 0)
  }

  ws.onclose = () => {
    console.log('Disconnected from the server')
  }

  ws.onerror = (error) => {
    console.log(error)
  }
})
</script>

<template>
  <canvas id="canvas" />
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
</style>
