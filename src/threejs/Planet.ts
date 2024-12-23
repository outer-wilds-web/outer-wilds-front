import * as THREE from 'three';

import SceneInit from './SceneInit';

import { loadModel } from '@/helpers/threejs_helper';

export default class Planet {
  radius: number;
  positionX: number;
  positionY: number;
  modelUrl: string;
  backupModelUrl: string;
  scene: SceneInit;
  group: THREE.Group;
  onLoad: () => void;

  constructor(radius: number, positionX: number, positionY: number, modelUrl: string, backupModelUrl: string, scene: SceneInit, onLoad: () => void) {
    this.radius = radius;
    this.positionX = positionX;
    this.positionY = positionY;
    this.modelUrl = modelUrl;
    this.backupModelUrl = backupModelUrl;
    this.scene = scene;
    this.group = new THREE.Group();
    this.onLoad = onLoad;

    loadModel(this.group, this.scene, this.modelUrl, this.backupModelUrl, [this.radius, this.radius, this.radius], [this.positionX, this.positionY, 0], this.onLoad);
  }
}