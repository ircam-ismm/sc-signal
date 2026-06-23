import { describe, it } from 'mocha';

import { assertWithRelativeError } from './shared/utils.js';

import { Lowpass } from '../src/Lowpass.js';

const epsilon = 1e-4; // low-resolution of reference values

describe(`Check Lowpass object`, () => {
  [
    [
      {
        sampleRate: 2, // normalised frequency
        lowpassFrequency: 0.9,
      },
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0.9, 0.99, 0.999, 0.9999, 0.99999, 0.999999],
    ],
    [
      {
        sampleRate: 2, // normalised frequency
        lowpassFrequency: 0.1,
      },
      [1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0.899999, 0.809999, 0.728999, 0.656099, 0.590489],
    ],
    [
      {
        sampleRate: 30, // Hertz
        lowpassFrequency: 5, // Hertz (same unit)
      },
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0.333333, 0.555556, 0.703704, 0.802469, 0.868313, 0.912209],
    ],
    // @fixme - there is an issue with this setup
    // [
    //   {
    //     sampleRate: 30, // Hertz
    //     lowpassFrequency: 10, // Hertz (same unit)
    //   },
    //   [1, 1, 1, 1, 0, 0, 0, 0, 0],
    //   [1, 1, 1, 1, 0.666667, 0.444444, 0.2962963, 0.19753086, 0.1316872, 0.01128175],
    // ],
    // no filtering
    [
      {
        sampleRate: 2, // normalised frequency
        lowpassFrequency: 1,
      },
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    ],
    // infinite hold
    [
      {
        sampleRate: 2, // normalised frequency
        lowpassFrequency: 0,
      },
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    // infinite hold
    [
      {
        sampleRate: 2, // normalised frequency
        lowpassFrequency: 0,
      },
      [1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
  ].forEach(([parameters, testValues, expectedValues], index) => {
    it(`should work - new instance ${index + 1}`, () => {
      const lowpass = new Lowpass(parameters);

      testValues.forEach((value, index) => {
        const expected = expectedValues[index];
        const transform = lowpass.process(value);

        assertWithRelativeError(
          transform,
          expected,
          epsilon,
          `lowpass ${JSON.stringify({
            setup: parameters,
            values: testValues,
            index,
            value,
            expected,
          })}`,
        );
      });
    });

    const lowpassReused = new Lowpass();

    it(`should work - reused instance ${index + 1}`, () => {
      lowpassReused.set(parameters);
      // be sure to reset to NOT continue with last test value
      lowpassReused.reset();

      testValues.forEach((value, index) => {
        const expected = expectedValues[index];
        const transform = lowpassReused.process(value);

        assertWithRelativeError(
          transform,
          expected,
          epsilon,
          `lowpass ${JSON.stringify({
            setup: parameters,
            values: testValues,
            index,
            value,
            expected,
          })}`,
        );
      });
    });
  });
});
