/**
 * @private
 *
 * _Experimental_ Do not document for now
 */
export class CategoricalHysteresis {
  #bufferSize;
  #ringBuffer;
  #ringIndex;
  #ringFilled;
  #lastOutputValue;

  constructor({
    bufferSize = 10,
  } = {}) {
    this.set({ bufferSize });
  }

  set(attributes) {
    if (!('bufferSize' in attributes)) {
      return;
    }

    const { bufferSize } = attributes;

    if (
      !Number.isFinite(bufferSize)
      || Math.floor(bufferSize) !== bufferSize
      || bufferSize < 2
    ) {
      throw new TypeError(`Cannot execute "set" on CategoricalHysteresis: Invalid "bufferSize" attribute, should an integer strictly greater than one`);
    }

    this.#bufferSize = bufferSize;

    this.init();
  }

  init() {
    this.#ringBuffer = new Array(this.#bufferSize);
    this.#ringIndex = 0;
    this.#ringFilled = false;
    this.#lastOutputValue = undefined;
  }

  process(inputValue) {
    this.#ringBuffer[this.#ringIndex] = inputValue;

    // first incoming value is last output until we find a new one
    if (this.#lastOutputValue === undefined) {
      this.#lastOutputValue = inputValue;
    }

    this.#ringIndex = (this.#ringIndex + 1) % this.#bufferSize;

    if (this.#ringIndex === 0) {
      this.#ringFilled = true;
    }

    const length = this.#ringFilled ? this.#bufferSize : this.#ringIndex;
    const bars = {};

    for (let i = 0; i < length; i++) {
      // parse the ring buffer in order of insertion, so that keys are sorted
      // from oldest one to newest one
      const index = (this.#ringIndex + i) % length;
      const value = this.#ringBuffer[index];

      if (!bars[value]) {
        bars[value] = 0;
      }

      bars[value] += 1;
    }

    // if all entries have same count, return last winner
    const counts = Object.values(bars);
    const keys = Object.keys(bars);

    let max = -Infinity;
    let index = -1;

    for (let i = 0; i < counts.length; i++) {
      // @tbc - define if we want to favor oldest inserted value (`>`) or
      // newest inserted value (`>=`) in case of equality
      if (counts[i] > max) {
        max = counts[i];
        index = i;
      }
    }

    // @tbc - in case of equality, give precedence to last output value to avoid oscillations
    if (max === bars[this.#lastOutputValue]) {
      return this.#lastOutputValue;
    }

    this.#lastOutputValue = keys[index];

    return this.#lastOutputValue;
  }
}
