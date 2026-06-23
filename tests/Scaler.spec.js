import { describe, it } from 'mocha';

import { assertWithRelativeError } from './shared/utils.js';

import { Scaler } from '../src/Scaler.js';

const epsilon = 1e-7;

describe(`Check Scaler object`, () => {
  [
    // linear
    [
      {
        inputStart: 5,
        inputEnd: 47,
        outputStart: -12,
        outputEnd: 3,
        base: 1,
        clip: true,
      },
      [ // input, scaled, inverse
        [5, -12, 5],
        [47, 3, 47],
        [33, -2, 33],
        // clip, then inverse
        [-12, -12, 5],
        [55, 3, 47],
      ],
    ],
    // start > end
    [
      {
        inputStart: 47,
        inputEnd: 5,
        outputStart: 3,
        outputEnd: -12,
        base: 1,
        clip: true,
      },
      [ // input, scaled, inverse
        [5, -12, 5],
        [47, 3, 47],
        [33, -2, 33],
        // clip, then inverse
        [-12, -12, 5],
        [55, 3, 47],
      ],
    ],
    // start > end
    [
      {
        inputStart: 47,
        inputEnd: 5,
        outputStart: -12,
        outputEnd: 3,
        base: 1,
        clip: true,
      },
      [ // input, scaled, inverse
        [5, 3, 5],
        [47, -12, 47],
        // clip, then inverse
        [-12, 3, 5],
        [55, -12, 47],
      ],
    ],
    // no input or output range
    [
      // linear
      {
        inputStart: 5,
        inputEnd: 5,
        outputStart: -5,
        outputEnd: 0,
        base: 1,
        clip: false,
      },
      [
        [5, -5, 5],
        [2, -5, 5],
        [12, 0, 5],
      ],
    ],
    [
      // logarithmic
      {
        inputStart: 5,
        inputEnd: 5,
        outputStart: -5,
        outputEnd: -5,
        base: 2,
        type: 'logarithmic',
        clip: false,
      },
      [
        [5, -5, 5],
        [2, -5, 5],
        [12, -5, 5],
      ],
    ],
    [
      // exponential
      {
        inputStart: 5,
        inputEnd: 5,
        outputStart: -5,
        outputEnd: -5,
        base: 2,
        type: 'exponential',
        clip: false,
      },
      [
        [5, -5, 5],
        [2, -5, 5],
        [12, -5, 5],
      ],
    ],
    // MIDI pitch to Hertz
    [
      // forward
      {
        inputStart: 69,
        inputEnd: 81,
        outputStart: 440,
        outputEnd: 880,
        type: 'exponential',
        base: 2,
        clip: false,
      },
      [
        [69, 440, 69],
        [72, 523.251131, 72],
        [81, 880, 81],
        // no clip
        [57, 220, 57],
        [93, 1760, 93],
      ],
    ],
    [
      // start > end
      {
        inputStart: 81,
        inputEnd: 69,
        outputStart: 880,
        outputEnd: 440,
        type: 'exponential',
        base: 0.5,
        clip: false,
      },
      [
        [69, 440, 69],
        [72, 523.251131, 72],
        [81, 880, 81],
        // no clip
        [57, 220, 57],
        [93, 1760, 93],
      ],
    ],
    // decibel to amplitude
    [
      // forward
      {
        inputStart: 0,
        inputEnd: 20,
        outputStart: 1,
        outputEnd: 10,
        type: 'exponential',
        base: 10,
        clip: false,
      },
      [
        [0, 1, 0],
        [20, 10, 20],
        // no clip
        [-20, 0.1, -20],
      ],
    ],
  ].forEach(([params, cases], index) => {
    it(`should validate values - new instance ${index + 1}`, () => {
      const scaler = new Scaler(params);

      cases.forEach(([value, expected]) => {
        const transform = scaler.process(value);

        assertWithRelativeError(
          transform,
          expected,
          epsilon,
          `scaler ${JSON.stringify({ params, value, expected })}`,
        );
      });
    });

    const scalerReused = new Scaler();

    it(`should validate values - reused instance ${index + 1}`, () => {
      scalerReused.set(params);

      cases.forEach(([value, expected]) => {
        const transform = scalerReused.process(value);

        assertWithRelativeError(
          transform,
          expected,
          epsilon,
          `scaler ${JSON.stringify({ params, value, expected })}`,
        );
      });
    });

    it(`should validate values - inverse ${index + 1}`, () => {
      const scaler = new Scaler(params);

      const scalerInverseSetup = {
        inputStart: params.outputStart,
        inputEnd: params.outputEnd,
        outputStart: params.inputStart,
        outputEnd: params.inputEnd,
        type: (params.type === 'logarithmic'
          ? 'exponential'
          : 'logarithmic'),
        base: params.base,
      };
      const scalerInverse = new Scaler(scalerInverseSetup);

      cases.forEach(([value, _, expected]) => {
        const transform = scaler.process(value);
        const transformInverse = scalerInverse.process(transform);

        assertWithRelativeError(
          transformInverse,
          expected,
          epsilon,
          `inverse scaler ${JSON.stringify({ params, value: transform, expected })}`,
        );
      });
    });
  });
});
