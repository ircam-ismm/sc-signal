/**
 * Represents a Clipper object that limits the range of input values.
 *
 * @example
 * // clip to [0,1]
 * const clipper = new Clipper({
 *  min: 0,
 *  max: 1,
 * });
 *
 * clipper.process(0.5); // 0.5
 * clipper.process(2); // 1
 * clipper.process(-1); // 0
 *
 * @example
 * // min only
 * const clipper = new Clipper({
 *   min: 0,
 * });
 *
 * clipper.process(0.5); // 0.5
 * clipper.process(2); // 2
 * clipper.process(-1); // 0
 *
 */
class Clipper {

  /**
   * Creates a new Clipper object.
   *
   * @param {Object} [options] - The options object.
   * @param {number} [options.min=-Infinity] - The minimum value of the range.
   * @param {number} [options.max=Infinity] - The maximum value of the range.
   */
  constructor({
    min = -Infinity,
    max = Infinity,
  } = {}) {
    this.min = min;
    this.max = max;
  }

  /**
   * Sets the attributes of the Clipper object.
   * @param {Object} attributes - The attributes to be set. Same as constructor options.
   */
  set(attributes) {
    Object.assign(this, attributes);
  }

  /**
   * Processes the input value and returns the clipped value within the specified range.
   * @param {number} inputValue - The input value to be processed.
   * @returns {number} The clipped value within the specified range.
   */
  process(inputValue) {
    return Math.min(this.max, Math.max(this.min, inputValue) );
  }
}
export { Clipper };
export default Clipper;

