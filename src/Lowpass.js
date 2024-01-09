import { hertzToNormalised } from '@ircam/sc-utils';

/**
 * Represents a Lowpass filter.
 * 
 * @example
 * const lowpass = new Lowpass({
 * sampleRate: 2, // normalised frequency
 * lowpassFrequency: 0.9,
 * });
 * 
 * lowpass.process(0); // 0
 * lowpass.process(1); // 0.9
 * lowpass.process(1); // 0.99
 * lowpass.process(1); // 0.999
 * lowpass.process(1); // 0.9999
 * lowpass.process(1); // 0.99999
 * lowpass.process(1); // 0.999999
 */
class Lowpass {

  /**
   * Creates a new instance of the Lowpass filter.
   * 
   * @param {Object} [options] - The options object.
   * @param {number} [options.sampleRate=2] - The sample rate in Hertz or 2 for normalized frequency.
   * @param {number} [options.lowpassFrequency=0.5] - The lowpass frequency in Hertz if sampleRate is defined, or normalized frequency.
   */
  constructor({
    sampleRate = 2,
    lowpassFrequency = 0.5,
  } = {}) {
    this.sampleRate = sampleRate;
    this.lowpassFrequency = lowpassFrequency;

    this.init();
  }

  /**
   * Sets the attributes of the Lowpass filter.
   * @param {Object} attributes - The attributes to set. Same as constructor options.
   */
  set(attributes) {
    Object.assign(this, attributes);
    this.init();
  }

  /**
   * Initializes the Lowpass filter.
   */
  init() {
    this.inputScale = Math.max(0, Math.min(1, hertzToNormalised(this.lowpassFrequency, {
      sampleRate: this.sampleRate,
    })));
    this.feedbackScale = 1 - this.inputScale;
  }

  /**
   * Processes the input value through the Lowpass filter.
   * @param {number} inputValue - The input value to process.
   * @returns {number} The filtered output value.
   */
  process(inputValue) {
    if (typeof this.outputValueLast === 'undefined') {
      this.outputValueLast = inputValue;
    }

    const { inputScale, feedbackScale } = this;
    const feedback = this.outputValueLast * feedbackScale;

    const outputValue = inputValue * inputScale + feedback;
    this.outputValueLast = outputValue;
    return outputValue;
  }

  /**
   * Resets the Lowpass filter.
   */
  reset() {
    this.outputValueLast = undefined;
  }
}
export { Lowpass };
export default Lowpass;

