/**
 * Represents a Scaler that maps values from an input range to an output range.
 *
 *
 * @example
 * // linear
 * const scaler = new Scaler({
 *   inputStart: 0,
 *   inputEnd: 10,
 *   outputStart: 0,
 *   outputEnd: 100,
 * });
 *
 * scaler.process(5); // 50
 * scaler.process(0); // 0
 * scaler.process(10); // 100
 *
 *
 * @example
 * // MIDI pitch to Hertz
 * const scaler = new Scaler({
 *   inputStart: 69,
 *   inputEnd: 81,
 *   outputStart: 440,
 *   outputEnd: 880,
 *   type: 'exponential',
 *   base: 2,
 *   clip: false,
 * });
 *
 * scaler.process(69); // 440
 * scaler.process(81); // 880
 * scaler.process(72); // 523.251131
 * scaler.process(93); // 1760 (no clipping)
 *
 * @example
 * // decibel to amplitude
 * const scaler = new Scaler({
 *   inputStart: 0,
 *   inputEnd: 20,
 *   outputStart: 1,
 *   outputEnd: 10,
 *   type: 'exponential',
 *   base: 10,
 *   clip: false,
 * });
 *
 * scaler.process(0); // 1
 * scaler.process(20); // 10
 * scaler.process(-20); // 0.1 (no clipping)
 *
 */
class Scaler {

  /**
   * Create a new Scaler instance.
   * 
   * @param {Object} [options] - The options object.
   * @param {number} [options.inputStart=0] - The start value of the input range.
   * @param {number} [options.inputEnd=1] - The end value of the input range.
   * @param {number} [options.outputStart=0] - The start value of the output range.
   * @param {number} [options.outputEnd=1] - The end value of the output range.
   * @param {boolean} [options.clip=false] - Whether to clip the input value to the input range.
   * @param {string} [options.type='linear'] - The type of scaling to use, in ['linear'|'logarithmic'|'exponential'].
   * @param {number} [options.base=1] - The base value for logarithmic and exponential scaling.
   */
  constructor({
    inputStart = 0,
    inputEnd = 1,
    outputStart = 0,
    outputEnd = 1,
    clip = false,
    type = 'linear',
    base = 1,
  } = {}) {
    this.inputStart = inputStart;
    this.inputEnd = inputEnd;
    this.outputStart = outputStart;
    this.outputEnd = outputEnd;
    this.clip = clip;
    this.type = type;
    this.base = base;

    this.init();
  }

  /**
   * Set the scaler attributes.
   * @param {Object} attributes - The attributes to set. Same as constructor options.
   */
  set(attributes) {
    Object.assign(this, attributes);
    this.init();
  }

  /**
   * Initialize the scaler.
   */
  init() {
    if (this.type === 'lin') {
      this.type = 'linear';
    } else if (this.type === 'log') {
      this.type = 'logarithmic';
    } else if (this.type === 'exp') {
      this.type = 'exponential';
    }

    this.base = Math.max(0, this.base);

    this.inputRange = this.inputEnd - this.inputStart;
    this.outputRange = this.outputEnd - this.outputStart;

    this.inputMin = Math.min(this.inputStart, this.inputEnd);
    this.inputMax = Math.max(this.inputStart, this.inputEnd);

    this.logBase = Math.log(this.base);
  }

  /**
   * Process the input value and return the scaled value.
   * @param {number} inputValue - The input value to scale.
   * @returns {number} The scaled output value.
   */
  process(inputValue) {
    if (this.inputRange === 0 || this.outputRange === 0) {
      return (inputValue <= this.inputMin
        ? this.outputStart
        : this.outputEnd);
    }

    const input = (this.clip
      ? Math.max(this.inputMin, Math.min(this.inputMax, inputValue) )
      : inputValue);

    if (this.base === 1 || this.type === 'linear') {
      return this.outputStart + this.outputRange
        * (input - this.inputStart) / this.inputRange;
    } else if (this.type === 'logarithmic') {
      return this.outputStart + this.outputRange
        * Math.log((this.base - 1) * (input - this.inputStart) / this.inputRange + 1)
        / this.logBase;
    } else {
      return this.outputStart + this.outputRange
        * (Math.exp(this.logBase * (input - this.inputStart) / this.inputRange) - 1)
        / (this.base - 1);
    }

  }


}
export { Scaler };
export default Scaler;

