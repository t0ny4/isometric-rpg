import { GameObject } from '../objects/GameObject';

/**
 * Base action class
 */
export class Action {
  name = 'BaseAction';

  /**
   * @type {GameObject}
   */
  source = null;

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
    // Do nothing
  }

  /**
   * Returns true/false if the action can be performed
   * @returns {Promise<{ value: boolean, reason: string? >}
   */
  async canPerform() {
    return { value: true };
  }
}