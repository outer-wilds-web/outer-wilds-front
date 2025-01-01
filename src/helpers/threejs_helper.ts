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

export function addPointToTrajectory(group: THREE.Group, trajectory: THREE.Points, ready: boolean = false) {
    if (ready) {
        const positions = trajectory.geometry.attributes.position.array
        const newPositions = new Float32Array(positions.length + 3)
        newPositions.set(positions)
        newPositions.set([group.position.x, group.position.y, group.position.z], positions.length)
        trajectory.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
        trajectory.geometry.attributes.position.needsUpdate = true
        trajectory.geometry.setDrawRange(0, newPositions.length / 3)
    }
}


export async function fetchShipHistory(shipId: string, ships: any) {
    try {
        const response = await fetch(`/api/ships/${shipId}/history`);
        const history = await response.json();
        updateTrajectoryWithHistory(shipId, history, ships);
    } catch (error) {
        console.error('Error fetching ship history:', error);
    }
}

function updateTrajectoryWithHistory(shipId: string, history: any, ships: any) {
    const trajectory = ships[shipId].trajectory
    const newPositions = new Float32Array(history.length * 3)
    for (let i = 0; i < history.length; i++) {
        newPositions.set([history[i].x, history[i].y, history[i].z], i * 3)
    }
    trajectory.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    trajectory.geometry.attributes.position.needsUpdate = true
    trajectory.geometry.setDrawRange(0, newPositions.length / 3)
}