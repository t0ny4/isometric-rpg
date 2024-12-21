import { GameObject } from '../objects/GameObject';

/**
 * Action for a ranged attack
 */
export class RangedHealAction {
  name = 'Ranged Heal';

  /**
   * @type {GameObject}
   */
  source = null;

  /**
   * @type {GameObject}
   */
  target = null;

  /**
   * @type {number}
   */
  maxDistance = 5;

  /**
   *
   * @param {GameObject} source
   */
  constructor(source) {
    this.source = source;
  }

  /**
   * Performs the action
   */
  async perform() {
    this.target.hit(-2);
  }

  /**
   * Returns true/false if the action can be performed
   * @returns {Promise<boolean>}
   */
  async canPerform() {
    this.target = await this.source.getTargetObject();

    if (!this.target) {
      return {
        value: false,
        reason: 'Must have a valid target'
      };
    }

	if (!this.target.isPlayer) {
		return {
			value: false,
			reason: 'Can only heal players'
		};
	}

    if (this.target === this.source) {
      return {
        value: false,
        reason: 'Cannot target self'
      };
    }

    const distance = this.target.coords.clone().sub(this.source.coords).length();

    // Target must be within range
    if (distance > this.maxDistance) {
      return {
        value: false,
        reason: 'Target is too far away'
      };
    }

    return { value: true };
  }
}
