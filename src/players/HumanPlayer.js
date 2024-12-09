import * as THREE from 'three';
import { Player } from './Player';
import { Action } from '../actions';
import { updateStatus } from '../utils';

export class HumanPlayer extends Player {
  name = 'HumanPlayer';

  /**
   * @type {THREE.Raycaster}
   */
  raycaster = new THREE.Raycaster();

  constructor(coords, camera, world) {
    super(coords, camera, world);
    this.raycaster.layers.disable(1);
  }

  /**
   * Wait for the player to choose a target square
   * @returns {Promise<Vector3 | null>}
   */
  async getTargetSquare() {
    updateStatus('Select a target square');

    return new Promise((resolve) => {
      /**
       * Event handler when user clicks on the screen
       * @param {MouseEvent} event 
       */
      const onMouseDown = (event) => {
        const coords = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          - (event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(coords, this.camera);
        const intersections = this.raycaster.intersectObject(this.world.terrain);

        if (intersections.length > 0) {
          const selectedCoords = new THREE.Vector3(
            Math.floor(intersections[0].point.x),
            0,
            Math.floor(intersections[0].point.z)
          );
          window.removeEventListener('mousedown', onMouseDown);
          resolve(selectedCoords);
        }
      };

      // Wait for player to select a square
      window.addEventListener('mousedown', onMouseDown);
    });
  }

  /**
   * Wait for the player to choose a target GameObject
   * @returns {Promise<GameObject | null>}
   */
  async getTargetObject() {
    updateStatus('Select a target object');

    return new Promise((resolve) => {
      /**
       * Event handler when user clicks on the screen
       * @param {MouseEvent} event 
       */
      const onMouseDown = (event) => {
        const coords = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          - (event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(coords, this.camera);
        const intersections = this.raycaster.intersectObject(this.world.objects, true);

        if (intersections.length > 0) {
          // Intersection is occurring with the mesh
          // The parent of the mesh is the GameObject
          const selectedObject = intersections[0].object.parent;
          window.removeEventListener('mousedown', onMouseDown);
          resolve(selectedObject);
        }
      };

      window.addEventListener('mousedown', onMouseDown);
    });
  }

  /**
   * Wait for the player to select an action to perform
   * @returns {Promise<Action | null>}
   */
  async requestAction() {
    const actionButtonContainer = document.getElementById('actions');
    actionButtonContainer.innerHTML = '';

    const actions = this.getActions();

    return new Promise((resolve) => {
      actions.forEach((action) => {
        const button = document.createElement('button');
        button.innerText = action.name;
        button.onclick = () => resolve(action);
        actionButtonContainer.appendChild(button);
      });
    });
  }
}