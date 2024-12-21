import * as THREE from 'three';
import { createHealthbarMaterial } from '../utils';

export class GameObject extends THREE.Group {
  /**
   * @type {THREE.Vector3}
   */
  coords;

  /**
   * @type {THREE.Mesh}
   */
  mesh;

  /**
   * @type {number}
   */
  hitPoints = 10;

  /**
   * @type {number}
   */
  maxHitPoints = 10;

  /**
   * @type {THREE.Sprite}
   */
  healthOverlay;

  healthOverlayHeight = 0.08;
  healthOverlayWidth = 0.5;

  /**
   * Callback triggered when the object moves
   * @param {GameObject} object
   * @param {THREE.Vector3} oldCoords
   * @param {THREE.Vector3} newCoords
   */
  onMove = (object, oldCoords, newCoords) => { }

  /**
   * Callback triggered when the object's hit points go to zero
   * @param {GameObject} object
   */
  onDestroy = (object) => { }

  /**
   * @param {THREE.Vector3} coords
   * @param {THREE.Mesh} mesh
   */
  constructor(coords, mesh) {
    super();

    this.coords = coords;
    this.position.copy(coords);

    this.mesh = mesh;
    this.add(mesh);

    this.healthOverlay = new THREE.Sprite();
    this.healthOverlay.position.set(0.5, 1.2, 0.5);
    this.healthOverlay.center = new THREE.Vector2(0.5, 0);
    this.healthOverlay.visible = false;
    this.healthOverlay.layers.set(1);
    this.add(this.healthOverlay);

    this.updateHitpointOverlay();
  }

  get isDead() {
    return (this.hitPoints === 0);
  }

  destroy() {
    this.healthOverlay.material.dispose();

    if (this.onDestroy) {
      this.onDestroy(this);
    }
  }

  hit(damage) {
    this.hitPoints -= damage;

    if (this.hitPoints <= 0) {
      this.hitPoints = 0;
      this.destroy();
    }

    this.updateHitpointOverlay();
	// make object healthbar visible when damaged
    this.healthOverlay.visible = true;
  }

  /**
   * Moves the player to the coordinates
   * @param {THREE.Vector3} coords
   */
  moveTo(coords) {
    const oldCoords = this.coords;

    this.coords = coords;
    this.position.copy(coords);

    if (this.onMove) {
      this.onMove(this, oldCoords, this.coords);
    }
  }

  updateHitpointOverlay() {
    if (this.healthOverlay.material) {
      this.healthOverlay.material.dispose();
    }
    this.healthOverlay.material = createHealthbarMaterial(this.hitPoints, this.maxHitPoints);
  }
}
