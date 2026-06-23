import { describe, it } from 'mocha';
import { assert } from 'chai';

import { CategoricalHysteresis } from '../src/CategoricalHysteresis.js';

describe('# CategoricalHysteresis', () => {
  [
    [
      {},
      [
        // input, output
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'], // 5a
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'],
        ['b', 'a'], // 5a / 5b -> favor lastValue
        ['b', 'b'], // 4a / 6b
        ['b', 'b'],
      ],
    ],
    [
      { bufferSize: 2 },
      [
        // input, output
        // favor current value in case of equality
        ['a', 'a'],
        ['b', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['b', 'b'],
      ],
    ],
    [
      { bufferSize: 4 },
      [
        // input, output
        ['a', 'a'],
        ['a', 'a'],
        ['b', 'a'],
        ['c', 'a'],
        ['b', 'b'],
        ['c', 'b'],
        ['c', 'c'],
      ],
    ],
  ].forEach(([params, testValues], index) => {
    it(`should properly work with new instance (${index + 1})`, () => {
      const hysteresis = new CategoricalHysteresis(params);

      testValues.forEach(([input, expected], index) => {
        const result = hysteresis.process(input);
        assert.equal(result, expected, `Failed new at index ${index}`);
      });
    });

    const hysteresisReused = new CategoricalHysteresis();

    it(`should properly work with reused instance (${index + 1})`, () => {
      hysteresisReused.set(params);

      testValues.forEach(([input, expected], index) => {
        const resultReused = hysteresisReused.process(input);
        assert.equal(resultReused, expected, `Failed reused at index ${index}`);
      });
    });
  });
});
