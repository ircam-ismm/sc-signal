import { hertzToNormalised } from '@ircam/sc-utils';

/**
 * Represents an Hysteresis filter.
 *
 * @example
 * // hysteresis with quick up and slow down
 * const hysteresis = new Hysteresis({
 *  sampleRate: 2, // normalised frequency
 *  lowpassFrequencyUp: 0.9,
 *  lowpassFrequencyDown: 0.1,
 * });
 *
 * hysteresis.process(0); // 0
 * hysteresis.process(1); // 0.9
 * hysteresis.process(1); // 0.99
 * hysteresis.process(1); // 0.999
 * hysteresis.process(1); // 0.9999
 * hysteresis.process(1); // 0.99999
 * hysteresis.process(1); // 0.999999
 * hysteresis.process(0); // 0.899999
 * hysteresis.process(0); // 0.809999
 * hysteresis.process(0); // 0.728999
 * hysteresis.process(0); // 0.656099
 * hysteresis.process(0); // 0.590489
 */
class Hysteresis {

  /**
   * Creates a new instance of the Hysteresis filter.
   *
   * @param {Object} [options] - The options object.
   * @param {number} [options.sampleRate=2] - The sample rate in Hertz or 2 for normalized frequency.
   * @param {number} [options.lowpassFrequencyUp=0.5] - The lowpass frequency for going up in Hertz if sampleRate is defined, or normalized.
   * @param {number} [options.lowpassFrequencyDown=0.5] - The lowpass frequency for going down in Hertz if sampleRate is defined, or normalized.
   */
  constructor({
    sampleRate = 2,
    lowpassFrequencyUp = 0.5,
    lowpassFrequencyDown = 0.5,
  } = {}) {
    this.sampleRate = sampleRate,
    this.lowpassFrequencyUp = lowpassFrequencyUp;
    this.lowpassFrequencyDown = lowpassFrequencyDown;

    this.init();
  }

  /**
   * Sets the attributes of the Hysteresis filter.
   * @param {Object} attributes - The attributes to set. Same as constructor options.
   */
  set(attributes) {
    Object.assign(this, attributes);

    this.init();
  }

  /**
   * Initializes the Hysteresis filter.
   */
  init() {
    // one low-pass filter with two separate frequencies for going up or down

    let inputScale;
    let feedbackScale;

    inputScale = Math.max(0, Math.min(1,
      hertzToNormalised(this.lowpassFrequencyUp, {
        sampleRate: this.sampleRate,
      }) ) );
    feedbackScale = 1 - inputScale;
    this.up = {
      inputScale,
      feedbackScale,
    };

    inputScale = Math.max(0, Math.min(1,
      hertzToNormalised(this.lowpassFrequencyDown, {
        sampleRate: this.sampleRate,
      }) ) );
    feedbackScale = 1 - inputScale;
    this.down = {
      inputScale,
      feedbackScale,
    };
  }

  /**
   * Processes the input value through the Hysteresis filter.
   * @param {number} inputValue - The input value to process.
   * @returns {number} The output value of the Hysteresis filter.
   */
  process(inputValue) {
    if (typeof this.outputValueLast === 'undefined') {
      this.outputValueLast = inputValue;
    }

    const direction = (inputValue > this.outputValueLast
      ? 'up'
      : 'down');

    const { inputScale, feedbackScale } = this[direction];
    // be sure to recompute feedback now with last output value
    // for smooth transition of frequency change
    const feedback = this.outputValueLast * feedbackScale;

    const outputValue = inputValue * inputScale + feedback;
    this.outputValueLast = outputValue;
    return outputValue;
  }

  /**
   * Resets the Hysteresis filter.
   */
  reset() {
    this.outputValueLast = undefined;
  }
}
export { Hysteresis };
export default Hysteresis;

