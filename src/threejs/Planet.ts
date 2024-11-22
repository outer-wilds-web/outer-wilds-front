import * as THREE from 'three';

export default class Planet {
  radius: number;
  positionX: number;
  positionY: number;
  textureFile: string;
  mesh: THREE.Mesh | null;

  constructor(radius: number, positionX: number, positionY: number, textureFile: string) {
    this.radius = radius;
    this.positionX = positionX;
    this.positionY = positionY;
    this.textureFile = textureFile;
    this.mesh = null;
  }

  getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
      const geometry = new THREE.SphereGeometry(this.radius);
      const texture = new THREE.TextureLoader().load(this.textureFile);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.x = this.positionX;
      this.mesh.position.y = this.positionY;
    }

    return this.mesh;
  }
}