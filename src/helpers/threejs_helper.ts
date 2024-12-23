import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import SceneInit from '@/threejs/SceneInit'

export function loadModel(group: THREE.Group, scene: SceneInit, url: string, backupUrl: string, scale: [number, number, number] = [1, 1, 1], position: [number, number, number] = [0, 0, 0], onLoad: () => void) {
    const loader = new GLTFLoader()
    loader.load(
        url,
        (gltf) => {
            group.add(gltf.scene)
            group.scale.set(scale[0], scale[1], scale[2])
            scene.scene.add(group)
            group.position.set(position[0], position[1], position[2])
            onLoad()
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error)
            if (backupUrl !== '') {
                console.warn('File not found, loading backup instead')
                loadModel(group, scene, backupUrl, '', scale, position, onLoad)
            } else {
                console.error('No backup found')
            }
        }
    )

}