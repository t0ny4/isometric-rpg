import * as THREE from 'three';

/**
 * @param {string} text
 */
export function updateStatus(text) {
  document.getElementById('status-text').innerText = text;
}

/**
 * @param {THREE.Vector3} coords
 * @returns Returns the key for the object map given a set of coordinates
 */
export function getKey(coords) {
  return `${coords.x}-${coords.y}-${coords.z}`;
}

/**
 *
 * @param {string} text
 * @returns {THREE.SpriteMaterial}
 */
export function createTextMaterial(text) {
  const size = 512;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  context.font = '100px Arial';
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  context.strokeStyle = 'black';
  context.lineWidth = 4;
  context.fillStyle = 'white';

  context.strokeText(text, size / 2, size / 2);
  context.fillText(text, size / 2, size / 2);

  return new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas)
  });
}

export const createHealthbarMaterial = (() => {

  const width = 96;
  const height = 14;
  const border = 2;
  const segmentCount = 25;

  const canvas = document.createElement('canvas');
  canvas.width = width + (border * 2);
  canvas.height = height + (border * 2);
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  const segmentSize = width / segmentCount;
  /** @type {THREE.CanvasTexture[]} */
  const textureCache = [];

  /**
   * @param {number} curHealth
   * @param {number} maxHealth
   * @returns {THREE.SpriteMaterial}
   */
  return (curHealth, maxHealth) => {

    //console.assert(maxHealth !== 0, 'maxHealth === 0');
    //console.assert(curHealth <= maxHealth, 'curHealth > maxHealth');

    const ratio = curHealth / maxHealth;
    const segment = Math.ceil(ratio * segmentCount);

    if (!textureCache[segment]) {

      const size = Math.round(segment * segmentSize);

      const colour = (ratio > 0.74) ? '#008000D0' : (ratio < 0.34) ? '#FF0000B0' : '#808000D0';

      const remaining = width - size;

      ctx.clearRect(border, border, width, height);

      if (size > 0) {
        ctx.fillStyle = colour;
        ctx.fillRect(border, border, size, height);
      }
      if (remaining > 0) {
        ctx.fillStyle = '#11111170';
        ctx.fillRect(border + size, border, remaining, height);
      }

      textureCache[segment] = new THREE.CanvasTexture(canvas);
    }

    return new THREE.SpriteMaterial({
      map: textureCache[segment]
    });
  };
})();
