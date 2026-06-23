import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Clipper } from '../src/Clipper.js';

describe(`Check Clipper object`, () => {
  [
    // default values: no clip
    [
      {},
      [ // input, clipped
        [5, 5],
        [47, 47],
        [33, 33],
        [-12, -12],
        [-Infinity, -Infinity],
        [Infinity, Infinity],
      ],
    ],
    // min, no max
    [
      {
        min: 1,
      },
      [
        [5, 5],
        [47, 47],
        [33, 33],
        [-12, 1],
        [1, 1],
        [0, 1],
        [-Infinity, 1],
        [Infinity, Infinity],
      ],
    ],
    // min and max
    [
      {
        min: -23,
        max: 21,
      },
      [
        [5, 5],
        [47, 21],
        [33, 21],
        [-122, -23],
        [-23, -23],
        [21, 21],
        [1, 1],
        [0, 0],
        [-Infinity, -23],
        [Infinity, 21],
      ],
    ],
  ].forEach(([params, testValues], index) => {
    it(`should properly work with new instance (${index + 1})`, () => {
      const clipper = new Clipper(params);

      testValues.forEach(([value, expected]) => {
        const transform = clipper.process(value);
        assert.equal(transform, expected, `clipper ${JSON.stringify({ params, value, expected })}`);
      });
    });

    const clipperReused = new Clipper();

    it(`should properly work with reused instance (${index + 1})`, () => {
      clipperReused.set(params);

      testValues.forEach(([value, expected]) => {
        const transform = clipperReused.process(value);
        assert.equal(transform, expected, `clipper ${JSON.stringify({ params, value, expected })}`);
      });
    });
  });
});
